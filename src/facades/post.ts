import { Cycle, Post, Prisma, User, Work } from '@prisma/client';

import { Session, StoredFileUpload } from '../types';
import { CreatePostServerFields, CreatePostServerPayload, PostDetail, PostDetailSpec, PostSumary, PostSumarySpec } from '../types/post';
import { prisma } from '@/src/lib/prisma';

const PostSumarySpecWithExtrasSpec = {
  select:{
    ...PostSumarySpec.select,
    favs: { select: { id: true } }
  }
}
type PostSumaryWithExtras = Prisma.PostGetPayload<typeof PostSumarySpecWithExtrasSpec>;
const PostDetailSpecWithExtrasSpec = {
  include:{
    ...PostDetailSpec.include,
    favs: { select: { id: true } }
  }
}
type PostDetailWithExtras = Prisma.PostGetPayload<typeof PostDetailSpecWithExtrasSpec>;

const PopulatePostSumaryWithExtras = (post:PostSumaryWithExtras,sessionId:number|null)=>{
  const currentUserIsFav = post?.favs?.findIndex(p=>p.id==sessionId)>-1;
  const p:Record<string,any> ={
    currentUserIsFav:currentUserIsFav,
    type:'post',
  };
  post = {...post,...p}
  
  return post as PostSumary;
}
const PopulatePostDetailWithExtras = (post:PostDetailWithExtras,sessionId:number|null)=>{debugger;
  const currentUserIsFav = post?.favs?.findIndex(p=>p.id==sessionId)>-1;
  const p:Record<string,any> ={
    currentUserIsFav:currentUserIsFav,
    type:'post',
  };
  post={...post,...p};
  return post;
}


export const find = async (id: number,sessionId:number|null): Promise<PostDetail | null> => {
  const ps = await prisma.post.findUnique({
    where: { id },
    include: {
      works: { select: { id: true, title: true, type: true, localImages: { select: { storedFile: true } } } },
      cycles: {
        select: {
          id: true,
          creator: { select: { name: true } },
          localImages: { select: { storedFile: true } },
          creatorId: true,
          startDate: true,
          endDate: true,
          title: true,
        },
      },
      favs: { select: { id: true } },
      creator: { select: { id: true, name: true, photos: true, countryOfOrigin: true } },
      localImages: { select: { storedFile: true } },
      reactions: true,
    },
  });
  return PopulatePostDetailWithExtras(ps as PostDetailWithExtras,sessionId);
};

export const findSumary = async (id: number,sessionId:number|null): Promise<PostSumary | null> => {
  const pf = await prisma.post.findUnique({
    where: { id },
    select:{
      ...PostSumarySpec.select,
      favs: { select: { id: true } },
    }
  });
  if(pf){
    return PopulatePostSumaryWithExtras(pf as PostSumaryWithExtras,sessionId);
  }
  return null;
};

export const findAll = async (sessionId:number|null, props?: Prisma.PostFindManyArgs, page?: number): Promise<PostDetail[]> => {
  const { where, take, skip, cursor } = props || {};
  const psf = await prisma.post.findMany({
    take,
    skip,
    cursor,
    orderBy: { createdAt: 'desc' },
    include:{
      ...PostDetailSpecWithExtrasSpec.include
    },
    where,
  });
  return psf?.map(p=>{
    return PopulatePostDetailWithExtras(p as PostDetailWithExtras,sessionId)
  })
};
export const findAllSumary = async (sessionId:number|null, props?: Prisma.PostFindManyArgs, page?: number): Promise<PostSumary[]> => {
  const { where, take, skip, cursor } = props || {};
  const psf = await prisma.post.findMany({
    take,
    skip,
    cursor,
    orderBy: { createdAt: 'desc' },
    select:{
      ...PostSumarySpecWithExtrasSpec.select,
    },
    where,
  });
  return psf?.map(p=>{
    return PopulatePostSumaryWithExtras(p as PostSumaryWithExtras,sessionId)
  })
};

export const search = async (query: { [key: string]: string | string[] | undefined }): Promise<Post[]> => {
  const { q, where } = query;
  if (where == null && q == null) {
    throw new Error("[412] Invalid invocation! Either 'q' or 'where' query parameter must be provided");
  }

  if (q && typeof q === 'string') {
    return prisma.post.findMany({
      where: { title: { contains: q } },
      include: {
        creator: true,
        localImages: true,
        works: true,
        cycles: true,
        favs: true,
        likes: true,
        comments: {
          include: {
            creator: { select: { id: true, name: true, image: true } },
            comments: { include: { creator: { select: { id: true, name: true, image: true } } } },
          },
        },
      },
    });
  }

  return prisma.post.findMany({
    ...(typeof where === 'string' && { where: JSON.parse(where) }),
    include: {
      creator: true,
      localImages: true,
      works: true,
      cycles: true,
      favs: true,
      likes: true,
      comments: {
        include: {
          creator: { select: { id: true, name: true, image: true } },
          comments: { include: { creator: { select: { id: true, name: true, image: true } } } },
        },
      },
    },
  });
};

export const isFavoritedByUser = async (post: Post, user: User): Promise<number> => {
  return prisma.post.count({
    where: {
      id: post.id,
      favs: { some: { id: user.id } },
    },
  });
};

export const isLikedByUser = async (post: Post, user: User): Promise<number> => {
  return prisma.post.count({
    where: {
      id: post.id,
      likes: { some: { id: user.id } },
    },
  });
};

export const createFromServerFields = async (
  fields: CreatePostServerFields,
  coverImageUpload: StoredFileUpload,
  creatorId: number,
): Promise<Post> => {
  const payload = Object.entries(fields).reduce((memo, [fieldName, fieldValues]) => {
    switch (fieldName) {
      case 'selectedCycleId':
      case 'selectedWorkId':
        return { ...memo, [fieldName]: Number(fieldValues[0]) };
      case 'isPublic':
        return { ...memo, [fieldName]: fieldValues[0] === 'true' };
      default:
        return { ...memo, [fieldName]: fieldValues[0] };
    }
  }, {} as CreatePostServerPayload);

  let existingCycle: Cycle | null = null;
  if (payload.selectedCycleId != null) {
    existingCycle = await prisma.cycle.findUnique({ where: { id: payload.selectedCycleId } });
    if (existingCycle == null) {
      throw new Error('[412] Invalid Cycle ID provided');
    }
  }

  let existingWork: Work | null = null;
  if (payload.selectedWorkId != null) {
    existingWork = await prisma.work.findUnique({ where: { id: payload.selectedWorkId } });
    if (existingWork == null) {
      throw new Error('[412] Invalid Work ID provided');
    }
  }

  const existingLocalImage = await prisma.localImage.findFirst({
    where: { contentHash: coverImageUpload.contentHash },
  });

  return prisma.post.create({
    data: {
      title: payload.title,
      contentText: payload.contentText,
      language: payload.language,
      isPublic: payload.isPublic,
      topics: payload.topics,
      tags: payload.tags,
      creator: { connect: { id: creatorId } },
      localImages: {
        connectOrCreate: {
          where: { id: existingLocalImage != null ? existingLocalImage.id : 0 },
          create: { ...coverImageUpload },
        },
      },
      ...(existingCycle != null && { cycles: { connect: { id: existingCycle.id } } }),
      ...(existingWork != null && { works: { connect: { id: existingWork.id } } }),
    },
  });
};

export const saveSocialInteraction = async (
  post: Post,
  user: User,
  socialInteraction: 'fav' | 'like',
  create: boolean,
): Promise<Post> => {
  return prisma.post.update({
    where: { id: post.id },
    data: { [`${socialInteraction}s`]: { [create ? 'connect' : 'disconnect']: { id: user.id } } },
  });
};

export const remove = async (post: PostDetail): Promise<Post> => {
  if (post.cycles.length) {
    await prisma.post.update({
      where: { id: post.id },
      data: {
        cycles: {
          disconnect: post.cycles.map((cycle) => ({
            id: cycle.id,
          })),
        },
      },
    });
  }

  if (post.works.length) {
    await prisma.post.update({
      where: { id: post.id },
      data: {
        works: {
          disconnect: post.works.map((work) => ({
            id: work.id,
          })),
        },
      },
    });
  }

  return prisma.post.delete({
    where: { id: post.id },
  });
};

export const updateFromServerFields = async (
  fields: CreatePostServerFields,
  coverImageUpload: StoredFileUpload | null,
  postId: number,
): Promise<Post> => {
  let payload = Object.entries(fields).reduce((memo, [fieldName, fieldValues]) => {
    switch (fieldName) {
      case 'selectedCycleId':
      case 'selectedWorkId':
        return { ...memo, [fieldName]: Number(fieldValues[0]) };
      case 'isPublic':
        return { ...memo, [fieldName]: fieldValues[0] === 'true' };
      default:
        return { ...memo, [fieldName]: fieldValues[0] };
    }
  }, {} as CreatePostServerPayload);

  let existingCycle: Cycle | null = null;

  if (payload.selectedCycleId != null) {
    existingCycle = await prisma.cycle.findUnique({ where: { id: payload.selectedCycleId } });
    if (existingCycle == null) {
      throw new Error('[412] Invalid Cycle ID provided');
    }
  }

  let existingWork: Work | null = null;
  if (payload.selectedWorkId != null) {
    existingWork = await prisma.work.findUnique({ where: { id: payload.selectedWorkId } });
    if (existingWork == null) {
      throw new Error('[412] Invalid Work ID provided');
    }
  }
  const cycles = existingCycle ? [{ id: existingCycle.id }] : [];
  const works = existingWork ? [{ id: existingWork.id }] : [];

  delete payload.selectedWorkId;
  delete payload.selectedCycleId;

  const existingLocalImage = coverImageUpload //NO EXISTE IMAGEN EN TABLA localImage
    ? await prisma.localImage.findFirst({
        where: { contentHash: coverImageUpload.contentHash },
      })
    : null;

  if (existingLocalImage != null) {
    const q1 = prisma.post.update({
      where: { id: postId },
      data: {
        localImages: {
          set: [],
        },
      },
    });

    await prisma.$transaction([q1]);

    return prisma.post.update({
      where: { id: postId },
      data: {
        ...payload,
        cycles: { set: cycles },
        works: { set: works },
        localImages: {
          connect: {
            id: existingLocalImage.id,
          },
        },
      },
    });
  }

  if (coverImageUpload !== null && !existingLocalImage) {
    const q1 = prisma.post.update({
      where: { id: postId },
      data: {
        cycles: { set: cycles },
        works: { set: works },
        localImages: {
          set: [],
        },
      },
    });

    await prisma.$transaction([q1]);

    return prisma.post.update({
      where: { id: postId },
      data: {
        ...payload,
        cycles: { set: cycles },
        works: { set: works },
        localImages: {
          create: { ...coverImageUpload! },
        },
      },
    });
  }

  return prisma.post.update({
    where: { id: postId },
    data: {
      ...payload,
      cycles: { set: cycles },
      works: { set: works },
    },
  });
};
