import { User } from '@prisma/client';
// import { UserDetail } from '../types/user';
import prisma from '../lib/prisma';

export interface findProps {
  id: number;
  select?: Record<string, boolean>;
  include?: boolean;
}
export const find = async (props: findProps): Promise<User | null> => {
  const { id, select = undefined, include = true } = props;
  return prisma.user.findUnique({
    where: { id },
    ...(select && { select }),
    ...(include && {
      include: {
        cycles: {
          include: { ratings: true, favs: true, works: true, localImages: true, participants: true },
        },
        joinedCycles: {
          include: { ratings: true, favs: true, works: true, localImages: true, participants: true },
        },
        // likedCycles: {
        //   include: { localImages: true },
        // },
        favCycles: {
          include: { ratings: true, favs: true, works: true, localImages: true, participants: true },
        },
        posts: {
          include: {
            creator: true,
            localImages: true,
            works: true,
            cycles: true,
            likes: true,
            favs: true,
          },
        },
        likedPosts: { include: { localImages: true } },
        favPosts: { include: { creator: true, favs: true, cycles: true, works: true, localImages: true } },
        likedWorks: {
          include: { localImages: true, ratings: true, favs: true },
        },
        favWorks: {
          include: { localImages: true, ratings: true, favs: true },
        },
        // readOrWatchedWorks: {
        //   include: { localImages: true, likes: true, favs: true, readOrWatcheds: true },
        // },
        following: true,
        followedBy: true,

        ratingWorks: {
          select: {
            qty: true,
            ratingOnWorkId: true,
            userId: true,
            work: { include: { localImages: true, ratings: true, favs: true } },
            workId: true,
          },
        },
        ratingCycles: {
          select: {
            qty: true,
            ratingOnCycleId: true,
            userId: true,
            cycle: { include: { ratings: true, favs: true, works: true, localImages: true, participants: true } },
            cycleId: true,
          },
        },
      },
    }),
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
      following: true,
      followedBy: true,
    },
  });
};

export const remove = async (id: number): Promise<User> => {
  return prisma.user.delete({
    where: { id },
  });
};
