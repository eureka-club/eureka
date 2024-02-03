import { Prisma, User } from '@prisma/client';
import { UserDetailSpec, UserDetail } from '@/types/user';
// import { UserDetail } from '../types/user';
import {prisma} from '@/src/lib/prisma';
import { CycleDetail, CycleDetailSpec } from '../types/cycle';
import { WorkMosaicItem } from '../types/work';
import { PostMosaicItem } from '../types/post';

const workInclude = {
  include: {
    _count: { select: { ratings: true } },
    localImages: { select: { id:true, storedFile: true } },
    favs: { select: { id: true } },
    ratings: { select: { userId: true, qty: true } },
    readOrWatchedWorks: { select: { userId: true, workId: true, year: true } },
    posts: {
      select: { id: true, updatedAt: true, localImages: { select: { storedFile: true } } },
    },
    editions:{include:{localImages: { select: { id:true, storedFile: true } }}},
  }
}


export const find = async (props: Prisma.UserFindUniqueArgs,language?:string): Promise<UserDetail | null> => {
  const { select = undefined, include = true,where } = props;
  const user = await prisma.user.findFirst({
    where,
    select: UserDetailSpec.select,
  });
  // user.favWorks.forEach((w:any)=>{
  //   w.currentUserIsFav = true
  // })
  return user;
};

export const findAll = async (props?:Prisma.UserFindManyArgs): Promise<UserDetail[]> => {
  const {where,take,skip,cursor} = props||{};
  const users =await prisma.user.findMany({
    take,
    skip,
    cursor,
    ...(where && { where }),
    orderBy: { createdAt: 'desc' },
    select: UserDetailSpec.select,
  });
  return users;
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

export const joinedCycles = async (id:number,lang?:string): Promise<CycleDetail[]> => {
  const res = await prisma.user.findFirst({
    where:{id},
    select: {
      joinedCycles:{include:CycleDetailSpec.include}
    }
  });
  
  return res?.joinedCycles.map((c:Partial<CycleDetail>)=>{
    c.type='cycle';
    return c as CycleDetail;
  })
  ??[];
};
export const cyclesCreated = async (id:number,lang?:string): Promise<CycleDetail[]> => {
  const res = await prisma.user.findFirst({
    where:{id},
    select: {
      cycles:{include:CycleDetailSpec.include}
    }
  });
  
  return res?.cycles.map((c:Partial<CycleDetail>)=>{
    c.type='cycle';
    return c as CycleDetail;
  })
  ??[];
};
export const postsCreated = async (id:number,lang?:string): Promise<PostMosaicItem[]> => {
  let res = await prisma.user.findFirst({
    where:{id},
    select: {
      posts:{
        include:{
          works:{select:{id:true,author:true,title:true,type:true,localImages:{select:{storedFile:true}}}},
          cycles:{select:{id:true,access:true,localImages:{select:{storedFile:true}},creatorId:true,startDate:true,endDate:true,title:true,participants:{select:{id:true}}}},
          favs:{select:{id:true,}},
          creator: {select:{id:true,name:true,photos:true,countryOfOrigin:true}},
          localImages: {select:{storedFile:true}},
          reactions:{select:{userId:true,unified:true,emoji:true,createdAt:true}},
        }
      }
    }
  });
  
  return res?.posts.map((p:Partial<PostMosaicItem>)=>{
    p.type='post';
    return p as PostMosaicItem;
  })
  ??[];
};
export const favPosts = async (id:number,lang?:string): Promise<PostMosaicItem[]> => {
  let res = await prisma.user.findFirst({
    where:{id},
    select: {
      favPosts:{
        include:{
          works:{select:{id:true,author:true,title:true,type:true,localImages:{select:{storedFile:true}}}},
          cycles:{select:{id:true,access:true,localImages:{select:{storedFile:true}},creatorId:true,startDate:true,endDate:true,title:true,participants:{select:{id:true}}}},
          favs:{select:{id:true,}},
          creator: {select:{id:true,name:true,photos:true,countryOfOrigin:true}},
          localImages: {select:{storedFile:true}},
          reactions:{select:{userId:true,unified:true,emoji:true,createdAt:true}},
        }
      }
    }
  });
  
  return res?.favPosts.map((p:Partial<PostMosaicItem>)=>{
    p.type='post';
    return p as PostMosaicItem;
  })
  ??[];
};
export const favCycles = async (id:number,lang?:string): Promise<CycleDetail[]> => {
  let res = await prisma.user.findFirst({
    where:{id},
    select: {
      favCycles:{
        include:CycleDetailSpec.include
      }
    }
  });
  
  return res?.favCycles.map((p:Partial<CycleDetail>)=>{
    p.type='cycle';
    return p as CycleDetail;
  })
  ??[];
};
export const favWorks = async (id:number,lang?:string): Promise<WorkMosaicItem[]> => {
  let res = await prisma.user.findFirst({
    where:{id},
    select: {
      favWorks:workInclude
    }
  });
  
  return res?.favWorks??[];
};

export const readOrWatchedWorks = async (id:number):Promise<{work:WorkMosaicItem|null,year:any}[]> => {
  let res = await prisma.user.findFirst({
    where:{id},
    select:{
      readOrWatchedWorks:{
        select:{
          work:workInclude,
          year:true
        }
      }
    }
  });
  return res?.readOrWatchedWorks!;
}

