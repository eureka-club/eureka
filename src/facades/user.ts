import { User } from '@prisma/client';
// import { UserDetail } from '../types/user';
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
          cycles: true,
          likes: true,
          favs: true,
        },
      },
      likedWorks: {
        include: { localImages: true, likes: true, favs: true, readOrWatcheds: true },
      },
      favWorks: {
        include: { localImages: true, likes: true, favs: true, readOrWatcheds: true },
      },
      readOrWatchedWorks: {
        include: { localImages: true, likes: true, favs: true, readOrWatcheds: true },
      },
      following: true,
      followedBy: true,
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
