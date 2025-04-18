import { Prisma } from '@prisma/client';
import { WorkSumarySpec } from './work';
import { CycleSumarySpec } from './cycle';
import { PostSumarySpec } from './post';

export interface EditUserClientPayload {
  name?: string;
  email?: string;
  password?:string;
  passwordConfirmation?:string;
  image?: string;
  countryOfOrigin?: string | null;
  aboutMe?: string;
  dashboardType?: number;
  tags?: string;
  photo?:File;
  language?:string|null;
}

export const UserDetailSpec = {
    include:{
      followedBy: { select: { id: true } },
      following: { select: { id: true, name: true, image: true, photos: { select: { storedFile: true } } } },
      ratingWorks: {
        select: {
          workId: true,
          qty: true,
          work: {
            select:WorkSumarySpec.select
          },
        },
      },
      readOrWatchedWorks: {
        select: {
          workId: true,
          year: true,
          work: {
            select:{
              ...WorkSumarySpec.select,
              authorGender:true,
              countryOfOrigin:true
            }
          },
        },
      },
      favWorks: {
        select:WorkSumarySpec.select
      },
      favCycles: {
        select:CycleSumarySpec.select
      },
      favPosts: {
        select: PostSumarySpec.select
      },
      cycles:{
        select:CycleSumarySpec.select
      },
      joinedCycles:{
        select:CycleSumarySpec.select
      },
      ratingCycles:{select:{cycleId:true,qty:true}},
      photos:{select:{storedFile:true}},
      reactions:{select:{postId:true,unified:true,emoji:true}},
    }
} 

export type UserDetail = Prisma.UserGetPayload<typeof UserDetailSpec> & {
  type?: 'user',
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
//     following: UserDetailSpec;
//     followedBy: UserDetailSpec;
//     ratingWorks: true;
//     ratingCycles: true;
//     ratingPosts: true;
//   };
// }>;
