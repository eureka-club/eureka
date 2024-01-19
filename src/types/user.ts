import { Prisma,User } from '@prisma/client';

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
  select:  {
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
    language:true,
    followedBy: { select: { id: true } },
    following: { select: { id: true, name: true, image: true, photos: { select: { storedFile: true } } } },
    ratingWorks: {
      select: {
        workId: true,
        qty: true,
        work: {
          select: {
            id: true,
            author: true,
            title: true,
            type: true,
            countryOfOrigin: true,
            countryOfOrigin2: true,
            favs: { select: { id: true } },
            localImages: { select: { storedFile: true } },
          },
        },
      },
    },
    ratingCycles:{select:{cycleId:true,qty:true}},
    photos:{select:{storedFile:true}},
    reactions:{select:{postId:true,unified:true,emoji:true}},
  }
};
export type UserDetail = Prisma.UserGetPayload<typeof UserDetailSpec> & {
  type?: 'user';
};

export const UserSumarySpec={
  select:{
    id:true,
    name:true,
    image:true,
    countryOfOrigin:true,
    tags:true,
    photos:{select:{storedFile:true}},
    followedBy: { select: { id: true } },
  }
}
export type UserSumary = Prisma.UserGetPayload<typeof UserSumarySpec> & {
  type?: 'user';
};
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
//     following: UserFoolow;
//     followedBy: UserFoolow;
//     ratingWorks: true;
//     ratingCycles: true;
//     ratingPosts: true;
//   };
// }>;
