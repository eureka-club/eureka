import { Prisma, Follows } from '@prisma/client';


type FG = {
  include:{
    following:{
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
      }
    }
  }
};

type FR = {
  include:{
    follower:{
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
      }
    }
  }
};

export type Following = Prisma.FollowsGetPayload<FG> ;

export type Follower = Prisma.FollowsGetPayload<FR> ;

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
