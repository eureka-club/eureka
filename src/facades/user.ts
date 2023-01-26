import { Prisma, User } from '@prisma/client';
import { UserMosaicItem } from '@/types/user';
// import { UserDetail } from '../types/user';
import {prisma} from '@/src/lib/prisma';

export const find = async (props: Prisma.UserFindUniqueArgs): Promise<UserMosaicItem | null> => {
  const { select = undefined, include = true,where } = props;
  return prisma.user.findUnique({
    where,
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
          work:{select:{id:true,createdAt:true,title:true,type:true,countryOfOrigin:true,countryOfOrigin2:true,localImages:{select:{storedFile:true}}}}
        }
      },
      favWorks:{select:{id:true,createdAt:true,title:true,type:true,countryOfOrigin:true,countryOfOrigin2:true,localImages:{select:{storedFile:true}}}},
      favCycles:{select:{id:true,createdAt:true,creatorId:true,startDate:true,endDate:true,title:true,localImages:{select:{storedFile:true}}}},
      favPosts:{select:{id:true,title:true,createdAt:true,localImages:{select:{storedFile:true}},works:{select:{id:true,title:true}},cycles:{select:{id:true,title:true}},creatorId:true}},
      cycles:{select:{id:true,creatorId:true,startDate:true,endDate:true,title:true}},
      joinedCycles:{select:{id:true,creatorId:true,startDate:true,endDate:true,title:true}},
      ratingCycles:{select:{cycleId:true}},
      photos:{select:{storedFile:true}},
    }
    
  });
};

export const findAll = async (props?:Prisma.UserFindManyArgs): Promise<UserMosaicItem[]> => {
  const {where,take,skip,cursor} = props||{};
  return prisma.user.findMany({
    take,
    skip,
    cursor,
    ... where && {where},
    orderBy: { createdAt: 'desc' },
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
          work:{select:{id:true,createdAt:true,title:true,type:true,countryOfOrigin:true,countryOfOrigin2:true,localImages:{select:{storedFile:true}}}}
        },
      },
      favWorks:{select:{id:true,createdAt:true,title:true,type:true,countryOfOrigin:true,countryOfOrigin2:true,localImages:{select:{storedFile:true}}}},
      favCycles:{select:{id:true,createdAt:true,creatorId:true,startDate:true,endDate:true,title:true}},
      favPosts:{select:{id:true,createdAt:true}},
      // posts:{select:{id:true}},
      cycles:{select:{id:true,creatorId:true,startDate:true,endDate:true,title:true}},
      joinedCycles:{select:{id:true,creatorId:true,startDate:true,endDate:true,title:true}},
      ratingCycles:{select:{cycleId:true}},
      photos:{select:{storedFile:true}},
      // notifications:{
      //   select:{
      //     userId:true,
      //     notificationId:true,
      //     notification:{select:{contextURL:true,message:true,createdAt:true}}
      //   }
      // }
    }
  });
};

export const remove = async (id: number): Promise<User> => {
  return prisma.user.delete({
    where: { id },
  });
};

export const update = async (id: number, data: Prisma.UserUpdateInput)=>{
  return prisma.user.update({
    data,
    where:{id}
  });
};
