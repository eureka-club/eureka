import { Prisma,User } from '@prisma/client';
import { WorkDetailSpec } from './work';
import { CycleDetailSpec } from './cycle';

export interface EditUserClientPayload {
  name?: string;
  email?: string;
  image?: string;
  countryOfOrigin?: string | null;
  aboutMe?: string;
  dashboardType?: number;
  tags?: string;
  photo?:File;
  language?:string|null;
}

export const UserDetailSpec = {
    id: true,
    name: true,
    email: true,
    image: true,
    roles: true,
    createdAt: true,
    updatedAt: true,
    countryOfOrigin: true,
    aboutMe: true,
    dashboardType: true,
    tags: true,
    followedBy: { select: { id: true } },
    following: { select: { id: true, name: true, image: true, photos: { select: { storedFile: true } } } },
    ratingWorks: {
      select: {
        workId: true,
        qty: true,
        work: {
          include:WorkDetailSpec.include
        },
      },
    },
    readOrWatchedWorks: {
      select: {
        workId: true,
        year: true,
        work: {
          include:WorkDetailSpec.include
        },
      },
    },
    favWorks: {
      include:WorkDetailSpec.include
    },
    favCycles: {
      include:CycleDetailSpec.include
    },
    favPosts: {
      select: {
        id: true,
        createdAt: true,
        favs: { select: { id: true } },
        localImages: { select: { storedFile: true } },
      },
    },
    cycles:{
      include:CycleDetailSpec.include
    },
    joinedCycles:{
      include:CycleDetailSpec.include
    },
    ratingCycles:{select:{cycleId:true,qty:true}},
    photos:{select:{storedFile:true}},
    reactions:{select:{postId:true,unified:true,emoji:true}},
} 

export type UserMosaicItem = Prisma.UserGetPayload<{select:typeof UserDetailSpec}> & {
  type?: 'user',
};

export const UserSumarySpec = {
  id:true,
  name:true,
  image:true,
  countryOfOrigin:true,
  tags:true,
  photos:true,
  followedBy:{select:{id:true}},
  following:{select:{id:true}},
} 

export type UserSumary = Prisma.UserGetPayload<{select: typeof UserSumarySpec}> & {
  type?:'user',
}

export type UserWhitPhoto = Prisma.UserGetPayload<{
  include:{photos:true}
}>;

// export type UserDetail = Prisma.UserGetPayload<{
//   include: {
//     cycles: true;
//     joinedCycles: true;
//     likedCycles: true;
//     favCycles: true;
//     posts: true;
//     likedWorks: true;
//     favWorks: true;
//     readOrWatchedWorks: true;
//     following: UserDetailSpec;
//     followedBy: UserDetailSpec;
//     ratingWorks: true;
//     ratingCycles: true;
//     ratingPosts: true;
//   };
// }>;
