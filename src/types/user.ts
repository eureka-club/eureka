import { Prisma, User } from '@prisma/client';
import { WorkDetailSpec, WorkSumarySpec } from './work';
import { CycleDetailSpec, CycleSumarySpec } from './cycle';

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
  // id: true,
  // name: true,
  // email: true,
  // image: true,
  // roles: true,
  // createdAt: true,
  // updatedAt: true,
  // countryOfOrigin: true,
  // aboutMe: true,
  // dashboardType: true,
  // tags: true,
  // language:true,
  followedBy: { select: { id: true } },
  following: { select: { id: true, name: true, image: true, photos: { select: { storedFile: true } } } },
  ratingWorks: {
    select: {
      workId: true,
      qty: true,
      work: {
        include:WorkSumarySpec
      },
    },
  },
  readOrWatchedWorks: {
    select: {
      workId: true,
      year: true,
      work: {
        include:WorkSumarySpec
      },
    },
  },
  favWorks: {
    include:WorkSumarySpec
  },
  favCycles: {
    include:CycleSumarySpec
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
    include:CycleSumarySpec
  },
  joinedCycles:{
    include:CycleSumarySpec
  },
  ratingCycles:{select:{cycleId:true,qty:true}},
  photos:{select:{storedFile:true}},
  reactions:{select:{postId:true,unified:true,emoji:true}},
} satisfies Prisma.UserInclude;

export type UserDetail = Prisma.UserGetPayload<{include:typeof UserDetailSpec}>  & {
  type?: 'user';
};

// let u:UserDetail={};

export const UserSumarySpec = {
  id:true,
  name:true,
  image:true,
  countryOfOrigin:true,
  tags:true,
  photos:{select:{storedFile:true}},
  followedBy: { select: { id: true } },
} satisfies Prisma.UserSelect;

export type UserSumary = Prisma.UserGetPayload<{select:typeof UserSumarySpec}>  & {
  type?: 'user';
};

export const UserWhitPhotoSpec = {
  photos:true
} satisfies Prisma.UserSelect;

export type UserWhitPhoto = typeof UserWhitPhotoSpec

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
