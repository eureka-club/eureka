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
}

type UserFoolow = {
  select:{
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
    followedBy:{select:{id:true}},
    following:{select:{id:true,name:true,image:true,photos:{select:{storedFile:true}}}},
    ratingWorks:{
      select:{
        workId:true,
        qty:true,
        work:{select:{id:true,author:true,title:true,type:true,countryOfOrigin:true,countryOfOrigin2:true,favs:{select:{id:true}},localImages:{select:{storedFile:true}}}}
      }
    },
    favWorks:{select:{id:true,createdAt:true,title:true,type:true,countryOfOrigin:true,countryOfOrigin2:true,favs:{select:{id:true}},localImages:{select:{storedFile:true}}}},
    favCycles:{select:{id:true,createdAt:true,creatorId:true,startDate:true,endDate:true,title:true,favs:{select:{id:true}},usersJoined:{select:{userId:true,pending:true}},participants:{select:{id:true}}}},
    favPosts:{select:{id:true,createdAt:true,favs:{select:{id:true}},localImages:{select:{storedFile:true}}}},
    // posts:{select:{id:true}},
    cycles:{select:{id:true,creatorId:true,startDate:true,endDate:true,title:true}},
    joinedCycles:{select:{id:true,creatorId:true,startDate:true,endDate:true,title:true}},
    ratingCycles:{select:{cycleId:true,qty:true}},
    photos:{select:{storedFile:true}},
    reactions:{select:{postId:true,emoji:true}},

    // notifications:{
    //   select:{
    //     userId:true,
    //     notificationId:true,
    //     notification:{select:{contextURL:true}}
    //   }
    // }
  }
  // include: {
  //   cycles: true;
  //   joinedCycles: true;
  //   likedCycles: true;
  //   favCycles: true;
  //   favPosts:true;
  //   posts: true;
  //   likedWorks: true;
  //   favWorks: true;
  //   ratingWorks:true;
  //   ratingCycles:true;
  //   readOrWatchedWorks: true;
  //   following: true;
  //   followedBy: true;
  //   photos:{select:{storedFile:true}};
  //   notifications:{
  //     include:{notification:{
  //       include:{
  //         toUsers:true;
  //       }
  //     }};
  //   }
  // };
};

export type UserMosaicItem = Prisma.UserGetPayload<UserFoolow> & {
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
