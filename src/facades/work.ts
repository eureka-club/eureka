import { Prisma, Work, User, RatingOnWork } from '@prisma/client';
import { StoredFileUpload } from '../types';
import { CreateWorkServerFields, CreateWorkServerPayload, WorkMosaicItem } from '../types/work';
import prisma from '../lib/prisma';

export const find = async (id: number): Promise<WorkMosaicItem | null> => {
  return prisma.work.findUnique({
    where: { id },
    include: {
      localImages: true,
      favs: true,
      ratings: true,
      posts: { include: { localImages: true, comments: true, favs: true } },
      comments: { include: { comments: true } },
    },
  });
};

export const findAll = async (): Promise<WorkMosaicItem[]> => {
  return prisma.work.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      localImages: true,
      ratings: true,
      favs: true,
      comments: {
        include: { comments: true },
      },
      posts: { include: { localImages: true, comments: true, favs: true } },
    },
  });
};

export const search = async (query: { [key: string]: string | string[] }): Promise<Work[]> => {
  const { q, where, include } = query;
  if (where == null && q == null) {
    throw new Error("[412] Invalid invocation! Either 'q' or 'where' query parameter must be provided");
  }

  if (typeof q === 'string') {
    return prisma.work.findMany({
      include: {
        // localImages: true,
        favs: true,
        ratings: true,
      },
      where: {
        OR: [{ title: { contains: q } }, { author: { contains: q } }],
      },
      ...(typeof include === 'string' && { include: JSON.parse(include) }),
    });
  }

  return prisma.work.findMany({
    ...(typeof where === 'string' && { where: JSON.parse(where) }),
    ...(typeof include === 'string' && { include: JSON.parse(include) }),
  });
};

export const countCycles = async (
  work: Work,
): Promise<Prisma.GetCycleAggregateType<{ count: true; where: { works: { some: { id: number } } } }>> => {
  return prisma.cycle.aggregate({
    count: true,
    where: { works: { some: { id: work.id } } },
  });
};

export const countPosts = async (
  work: Work,
): Promise<Prisma.GetPostAggregateType<{ count: true; where: { works: { some: { id: number } } } }>> => {
  return prisma.post.aggregate({
    count: true,
    where: { works: { some: { id: work.id } } },
  });
};

export const isFavoritedByUser = async (work: Work, user: User): Promise<number> => {
  return prisma.work.count({
    where: {
      id: work.id,
      favs: { some: { id: user.id } },
    },
  });
};

export const isLikedByUser = async (work: Work, user: User): Promise<number> => {
  return prisma.work.count({
    where: {
      id: work.id,
      likes: { some: { id: user.id } },
    },
  });
};

export const isReadOrWatchedByUser = async (work: Work, user: User): Promise<number> => {
  return prisma.work.count({
    where: {
      id: work.id,
      readOrWatcheds: { some: { id: user.id } },
    },
  });
};

export const createFromServerFields = async (
  fields: CreateWorkServerFields,
  coverImageUpload: StoredFileUpload,
): Promise<Work> => {
  const payload = Object.entries(fields).reduce((memo, field) => {
    const [fieldName, fieldValues] = field;

    if (fieldName === 'publicationYear') {
      return { ...memo, [fieldName]: new Date(fieldValues[0]) };
    }

    return { ...memo, [fieldName]: fieldValues[0] };
  }, {} as CreateWorkServerPayload);

  const existingLocalImage = await prisma.localImage.findFirst({
    where: { contentHash: coverImageUpload.contentHash },
  });

  if (existingLocalImage != null) {
    return prisma.work.create({
      data: {
        ...payload,
        localImages: {
          connect: {
            id: existingLocalImage.id,
          },
        },
      },
    });
  }

  return prisma.work.create({
    data: {
      ...payload,
      localImages: {
        create: { ...coverImageUpload },
      },
    },
  });
};

export const saveSocialInteraction = async (
  work: Work,
  user: User,
  socialInteraction: 'fav' | 'rating',
  create: boolean,
  qty?: number,
): Promise<Work | null> => {
  if (socialInteraction !== 'rating') {
    return prisma.work.update({
      where: { id: work.id },
      data: { [`${socialInteraction}s`]: { [create ? 'connect' : 'disconnect']: { id: user.id } } },
    });
  }
  const rating: RatingOnWork | null = await prisma.ratingOnWork.findFirst({
    where: { userId: user.id, workId: work.id },
  });

  if (create) {
    if (rating) {
      const q1 = prisma.work.update({
        where: { id: work.id },
        data: {
          ratings: {
            disconnect: {
              ratingOnWorkId: rating.ratingOnWorkId,
            },
          },
        },
      });

      const q2 = prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          ratingWorks: {
            disconnect: {
              ratingOnWorkId: rating.ratingOnWorkId,
            },
          },
        },
      });

      const q3 = prisma.ratingOnWork.delete({
        where: {
          ratingOnWorkId: rating.ratingOnWorkId,
        },
      });

      await prisma.$transaction([q1, q2, q3]);

      return prisma.work.update({
        where: { id: work.id },
        data: {
          ratings: {
            connectOrCreate: {
              where: {
                ratingOnWorkId: -1, // faild always, so a create will be executed :-)
              },
              create: {
                userId: user.id,
                qty,
              },
            },
          },
        },
      });
    }

    return prisma.work.update({
      where: { id: work.id },
      data: {
        ratings: {
          connectOrCreate: {
            where: {
              ratingOnWorkId: -1, // faild always, so a create will be executed :-)
            },
            create: {
              userId: user.id,
              qty,
            },
          },
        },
      },
    });
  }
  if (rating) {
    const q1 = prisma.work.update({
      where: { id: work.id },
      data: {
        ratings: {
          disconnect: {
            ratingOnWorkId: rating.ratingOnWorkId,
          },
        },
      },
    });

    const q2 = prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ratingWorks: {
          disconnect: {
            ratingOnWorkId: rating.ratingOnWorkId,
          },
        },
      },
    });

    const q3 = prisma.ratingOnWork.delete({
      where: {
        ratingOnWorkId: rating.ratingOnWorkId,
      },
    });

    const res = await prisma.$transaction([q1, q2, q3]);
    return res[0];
  }
  return null;
};

export const remove = async (id: number): Promise<Work> => {
  return prisma.work.delete({
    where: { id },
  });
};
