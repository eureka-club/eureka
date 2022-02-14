import { Prisma, User } from '@prisma/client';
import { UserMosaicItem } from '@/types/user';
// import { UserDetail } from '../types/user';
import prisma from '../lib/prisma';

export interface findProps {
  id: string;
  select?: Record<string, boolean>;
  include?: boolean;
}
export const find = async (props: findProps): Promise<User | UserMosaicItem | null> => {
  const { id, select = undefined, include = true } = props;
  return prisma.user.findUnique({
    where: { 
      id,
    },
    // ...(select && { select }),
    ...(include && {
      include: {
        notifications:{
          include:{
            notification:true,
            // notification:{
            //   include:{
            //     toUsers:true
            //   }
            // },
          },
          where:{viewed: false},
          orderBy:{notificationId:"desc"}
        },
        cycles: {
          include: { ratings: true, favs: true, works: true, localImages: true, participants: true },
          orderBy: {
            createdAt: 'desc',
          },
        },
        joinedCycles: {
          include: { ratings: true, favs: true, works: true, localImages: true, participants: true },
          orderBy: {
            createdAt: 'desc',
          },
        },
        // likedCycles: {
        //   include: { localImages: true },
        // },
        favCycles: {
          include: { ratings: true, favs: true, works: true, localImages: true, participants: true },
          orderBy: {
            createdAt: 'desc',
          },
        },
        posts: {
          include: {
            creator: true,
            localImages: true,
            works: {
              include: { localImages: true, ratings: true, favs: true },
            },
            cycles: {include:{localImages:true}},
            likes: true,
            favs: true,
            comments: {
              include: {
                creator: { select: { id: true, name: true, image: true } },
                comments: { include: { creator: { select: { id: true, name: true, image: true } } } },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        likedPosts: { include: { localImages: true } },
        favPosts: {
          include: {
            creator: true,
            favs: true,
            cycles: true,
            works: true,
            localImages: true,
            comments: {
              include: {
                creator: { select: { id: true, name: true, image: true } },
                comments: { include: { creator: { select: { id: true, name: true, image: true } } } },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        likedWorks: {
          include: { localImages: true, ratings: true, favs: true },
          orderBy: {
            createdAt: 'desc',
          },
        },
        favWorks: {
          include: { localImages: true, ratings: true, favs: true },
          orderBy: {
            createdAt: 'desc',
          },
        },
        // readOrWatchedWorks: {
        //   include: { localImages: true, likes: true, favs: true, readOrWatcheds: true },
        // },
        following: {
          include:{following:{include: {
            cycles: true,
            joinedCycles: true,
            likedCycles: true,
            favCycles: true,
            favPosts:true,
            posts: true,
            likedWorks: true,
            favWorks: true,
            ratingWorks:true,
            ratingCycles:true,
            readOrWatchedWorks: true,
            following: true,
            followedBy: true,
            photos:true,
            notifications:{
              include:{notification:{
                include:{
                  toUsers:true,
                }
              }},
            }
          },}}
        },
        followedBy: {
          include:{follower:{include: {
            cycles: true,
            joinedCycles: true,
            likedCycles: true,
            favCycles: true,
            favPosts:true,
            posts: true,
            likedWorks: true,
            favWorks: true,
            ratingWorks:true,
            ratingCycles:true,
            readOrWatchedWorks: true,
            following: true,
            followedBy: true,
            photos:true,
            notifications:{
              include:{notification:{
                include:{
                  toUsers:true,
                }
              }},
            }
          },}}
        },

        ratingWorks: {
          select: {
            createdAt: true,
            qty: true,
            ratingOnWorkId: true,
            userId: true,
            work: { include: { localImages: true, ratings: true, favs: true } },
            workId: true,
          },
          // include:{
          //   work: { include: { localImages: true, ratings: true, favs: true } },
          // },
          orderBy: {
            createdAt: 'desc',
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
          orderBy: {
            createdAt: 'desc',
          },
        },
        photos:{
          select:{
            originalFilename:true,
            storedFile:true,
          }
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

export const remove = async (id: string): Promise<User> => {
  return prisma.user.delete({
    where: { id },
  });
};

export const update = async (id: string, data: Prisma.UserUpdateInput)=>{
  return prisma.user.update({
    data,
    where:{id}
  });
};

export const create = async (id: string, data: Prisma.UserCreateInput)=>{
  return prisma.user.create({
    data
  });
};
