import { Cycle, Post, Prisma, User, Work } from '@prisma/client';

import { StoredFileUpload } from '../types';
import { CreatePostServerFields, CreatePostServerPayload, PostWithCyclesWorks, PostMosaicItem } from '../types/post';
import {prisma} from '@/src/lib/prisma';

export const find = async (id: number): Promise<PostMosaicItem | null> => {
  return prisma.post.findUnique({
    where: { id },
    include:{
      works:{select:{id:true,title:true,type:true,localImages:{select:{storedFile:true}}}},
      cycles:{select:{id:true,localImages:{select:{storedFile:true}},creatorId:true,startDate:true,endDate:true,title:true}},
      favs:{select:{id:true,}},
      creator: {select:{id:true,name:true,photos:true,countryOfOrigin:true}},
      localImages: {select:{storedFile:true}},
    }
    // include: {
    //   creator: {select:{id:true,name:true,photos:true}},
    //   localImages: {select:{storedFile:true}},
    //   works: {
    //     include: {
    //       localImages: true,
    //     },
    //   },
    //   cycles: {
    //     include: {        
    //       localImages: {select:{storedFile:true}},
    //       participants:{select:{id:true}}
    //     },
    //   },
    //   likes: true,
    //   favs: true,
    //   comments: {
    //     include: {
    //       creator: { include: { photos:true } },
    //       comments: {
    //         include: {
    //           creator: { include: { photos:true } },
    //         },
    //       },
    //       work: {include:{cycles:true}},
    //       cycle: {include:{participants:{select:{id:true}}}}
    //     },
    //   },
    // }
  });
};


export const findAll = async (props?:Prisma.PostFindManyArgs,page?:number): Promise<PostMosaicItem[]> => {
  const {include,where,take,skip,cursor} = props || {};
  return prisma.post.findMany({
    take,
    skip,
    cursor,
    orderBy: { createdAt: 'desc' },
    include:{
      works:{select:{id:true,title:true,type:true,localImages:{select:{storedFile:true}}}},
      cycles:{select:{id:true,localImages:{select:{storedFile:true}},creatorId:true,startDate:true,endDate:true,title:true}},
      favs:{select:{id:true,}},
      creator: {select:{id:true,name:true,photos:true,countryOfOrigin:true}},
      localImages: {select:{storedFile:true}},
    },    
    where,
  });
};

export const search = async (query: { [key: string]: string | string[] }): Promise<Post[]> => {
  const { q, where /* , include */ } = query;
  if (where == null && q == null) {
    throw new Error("[412] Invalid invocation! Either 'q' or 'where' query parameter must be provided");
  }

  if (q && typeof q === 'string') {
    return prisma.post.findMany({
      where: { title: { contains: q } },
      // ...(typeof include === 'string' && { include: JSON.parse(include) }),
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
    // ...(typeof include === 'string' && { include: JSON.parse(include) }),
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

export const remove = async (post: PostMosaicItem): Promise<Post> => {
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
