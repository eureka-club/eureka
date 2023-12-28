import { Cycle, Post, Prisma, User, Work } from '@prisma/client';

import { StoredFileUpload } from '../types';
import { CreatePostServerFields, CreatePostServerPayload, EditPostServerFields, PostMosaicItem } from '../types/post';
import { prisma } from '@/src/lib/prisma';

export const find = async (id: number): Promise<PostMosaicItem | null> => {
  return prisma.post.findUnique({
    where: { id },
    include: {
      works: { select: { id: true, title: true,author:true, type: true, localImages: { select: { storedFile: true } } } },
      cycles:{
        include: {
          creator: {
            select: { id: true, name: true, email: true, countryOfOrigin: true },
          },
          localImages: {
            select: {
              storedFile: true,
            },
          },
          guidelines: {
            select: {
              title: true,
              contentText: true,
            },
          },
          usersJoined: { select: { userId: true, pending: true } },
          ratings: { select: { userId: true, qty: true } },
          works: {
            include: {
              _count: { select: { ratings: true } },
              localImages: { select: { id:true,storedFile: true } },
              favs: { select: { id: true } },
              ratings: { select: { userId: true, qty: true } },
              readOrWatchedWorks: { select: { userId: true, workId: true, year: true } },
              posts: {
                select: { id: true, updatedAt: true, localImages: { select: { storedFile: true } } },
              },
              editions:{include:{localImages: { select: { id:true,storedFile: true } }}},
            },
          },
          favs: { select: { id: true } },
          cycleWorksDates: {
            select: {
              id: true,
              startDate: true,
              endDate: true,
              workId: true,
              work: {
                include: {
                  _count: { select: { ratings: true } },
                  localImages: { select: { id:true,storedFile: true } },
                  favs: { select: { id: true } },
                  ratings: { select: { userId: true, qty: true } },
                  readOrWatchedWorks: { select: { userId: true, workId: true, year: true } },
                  posts: {
                    select: { id: true, updatedAt: true, localImages: { select: { storedFile: true } } },
                  },
                  editions:{include:{localImages: { select: { id:true,storedFile: true } }}},
                },
              },
            },
          },
          _count: {
            select: {
              participants: true,
              ratings: true,
            },
          },
          complementaryMaterials: true,
        }
      },
      favs: { select: { id: true } },
      creator: { select: { id: true, name: true, photos: true, countryOfOrigin: true } },
      localImages: { select: { storedFile: true } },
      reactions: true,
    },
  });
};
export const findAll = async (props?: Prisma.PostFindManyArgs, page?: number): Promise<PostMosaicItem[]> => {
  const { include, where, take, skip, cursor } = props || {};
  return prisma.post.findMany({
    take,
    skip,
    cursor,
    orderBy: { createdAt: 'desc' },
    include: {
      works: { select: { id: true, title: true,author:true, type: true, localImages: { select: { storedFile: true } } } },
      cycles:{
        include: {
          creator: {
            select: { id: true, name: true, email: true, countryOfOrigin: true },
          },
          localImages: {
            select: {
              storedFile: true,
            },
          },
          guidelines: {
            select: {
              title: true,
              contentText: true,
            },
          },
          usersJoined: { select: { userId: true, pending: true } },
          ratings: { select: { userId: true, qty: true } },
          works: {
            include: {
              _count: { select: { ratings: true } },
              localImages: { select: { id:true,storedFile: true } },
              favs: { select: { id: true } },
              ratings: { select: { userId: true, qty: true } },
              readOrWatchedWorks: { select: { userId: true, workId: true, year: true } },
              posts: {
                select: { id: true, updatedAt: true, localImages: { select: { storedFile: true } } },
              },
              editions:{include:{localImages: { select: { id:true,storedFile: true } }}},
            },
          },
          favs: { select: { id: true } },
          cycleWorksDates: {
            select: {
              id: true,
              startDate: true,
              endDate: true,
              workId: true,
              work: {
                include: {
                  _count: { select: { ratings: true } },
                  localImages: { select: { id:true,storedFile: true } },
                  favs: { select: { id: true } },
                  ratings: { select: { userId: true, qty: true } },
                  readOrWatchedWorks: { select: { userId: true, workId: true, year: true } },
                  posts: {
                    select: { id: true, updatedAt: true, localImages: { select: { storedFile: true } } },
                  },
                  editions:{include:{localImages: { select: { id:true,storedFile: true } }}},
                },
              },
            },
          },
          _count: {
            select: {
              participants: true,
              ratings: true,
            },
          },
          complementaryMaterials: true,
        }
      },
      favs: { select: { id: true } },
      creator: { select: { id: true, name: true, photos: true, countryOfOrigin: true } },
      localImages: { select: { storedFile: true } },
      reactions: true,
    },
    where,
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
export const createFromServerFields = async (
  fields: CreatePostServerFields,
  coverImageUpload: StoredFileUpload,
  creatorId: number,
): Promise<Post> => {
  const payload = Object.entries(fields).reduce((memo, [fieldName, fieldValue]) => {
    switch (fieldName) {
      case 'selectedCycleId':
      case 'selectedWorkId':
        return { ...memo, [fieldName]: Number(fieldValue) };
      case 'isPublic':
        return { ...memo, [fieldName]: fieldValue === 'true' };
      default:
        return { ...memo, [fieldName]: fieldValue };
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
export const updateFromServerFields = async (
  fields: EditPostServerFields,
  coverImageUpload: StoredFileUpload | null,
  postId: number,
): Promise<Post> => {
  let payload = Object.entries(fields).reduce((memo, [fieldName, fieldValues]) => {
    switch (fieldName) {
      case 'selectedCycleId':
      case 'selectedWorkId':
        return { ...memo, [fieldName]: Number(fieldValues) };
      case 'isPublic':
        return { ...memo, [fieldName]: fieldValues === 'true' };
      default:
        return { ...memo, [fieldName]: fieldValues };
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
