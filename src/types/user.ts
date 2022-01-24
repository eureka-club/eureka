import { Prisma } from '@prisma/client';

export interface EditUserClientPayload {
  name?: string;
  email?: string;
  image?: string;
  countryOfOrigin?: string | null;
  aboutMe?: string;
  dashboardType: number;
  tags?: string;
  photo?:File;
}

type UserFoolow = {
  include: {
    cycles: true;
    joinedCycles: true;
    likedCycles: true;
    favCycles: true;
    favPosts:true;
    posts: true;
    likedWorks: true;
    favWorks: true;
    ratingWorks:true;
    ratingCycles:true;
    readOrWatchedWorks: true;
    following: true;
    followedBy: true;
    photos:true;
    notifications:{
      include:{notification:{
        include:{
          toUsers:true;
        }
      }};
    }
  };
};

export type UserMosaicItem = Prisma.UserGetPayload<UserFoolow> & {
  type?: 'user';
};

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
//     following: UserFoolow;
//     followedBy: UserFoolow;
//     ratingWorks: true;
//     ratingCycles: true;
//     ratingPosts: true;
//   };
// }>;
