import { Prisma, Work, User } from '@prisma/client';
import {
  // CreateWorkServerFields,
  // CreateWorkServerPayload,
  WorkDetail,
  WorkWithImages,
} from '../types/work';
import prisma from '../lib/prisma';

export const find = async (id: number): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { id },
    include: {
      cycles: {
        include: { localImages: true },
      },
      joinedCycles: {
        include: { localImages: true },
      },
      likedCycles: {
        include: { localImages: true },
      },
      favCycles: {
        include: { localImages: true },
      },
      posts: {
        include: {
          creator: true,
          localImages: true,
          works: true,
          likes: true,
          favs: true,
        },
      },
      likedWorks: {
        include: { localImages: true },
      },
      favWorks: {
        include: { localImages: true },
      },
    },
  });
};

export const findAll = async (): Promise<User[]> => {
  return prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      cycles: {
        include: { localImages: true },
      },
      posts: {
        include: {
          creator: true,
          localImages: true,
          works: true,
          likes: true,
          favs: true,
        },
      },
      joinedCycles: true,
    },
  });
};

// export const search = async (query: { [key: string]: string | string[] }): Promise<Work[]> => {
//   const { q, where, include } = query;
//   if (where == null && q == null) {
//     throw new Error("[412] Invalid invocation! Either 'q' or 'where' query parameter must be provided");
//   }

//   if (typeof q === 'string') {
//     return prisma.work.findMany({
//       where: {
//         OR: [{ title: { contains: q } }, { author: { contains: q } }],
//       },
//       ...(typeof include === 'string' && { include: JSON.parse(include) }),
//     });
//   }

//   return prisma.work.findMany({
//     ...(typeof where === 'string' && { where: JSON.parse(where) }),
//     ...(typeof include === 'string' && { include: JSON.parse(include) }),
//   });
// };

/* export const countCycles = async (
  work: Work,
): Promise<Prisma.GetCycleAggregateType<{ count: true; where: { works: { some: { id: number } } } }>> => {
  return prisma.cycle.aggregate({
    count: true,
    where: { works: { some: { id: work.id } } },
  });
};
 */
/* export const countPosts = async (
  work: Work,
): Promise<Prisma.GetPostAggregateType<{ count: true; where: { works: { some: { id: number } } } }>> => {
  return prisma.post.aggregate({
    count: true,
    where: { works: { some: { id: work.id } } },
  });
};
 */
/* export const isFavoritedByUser = async (work: Work, user: User): Promise<number> => {
  return prisma.work.count({
    where: {
      id: work.id,
      favs: { some: { id: user.id } },
    },
  });
};
 */
/* export const isLikedByUser = async (work: Work, user: User): Promise<number> => {
  return prisma.work.count({
    where: {
      id: work.id,
      likes: { some: { id: user.id } },
    },
  });
};
 */

/* export const saveSocialInteraction = async (
  work: Work,
  user: User,
  socialInteraction: 'fav' | 'like',
  create: boolean,
): Promise<Work> => {
  return prisma.work.update({
    where: { id: work.id },
    data: { [`${socialInteraction}s`]: { [create ? 'connect' : 'disconnect']: { id: user.id } } },
  });
};
 */

export const remove = async (id: number): Promise<User> => {
  return prisma.user.delete({
    where: { id },
  });
};
