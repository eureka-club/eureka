import { Prisma, User } from '@prisma/client';
import { UserDetailSpec, UserDetail, UserSumary, UserSumarySpec } from '@/types/user';
// import { UserDetail } from '../types/user';
import {prisma} from '@/src/lib/prisma';
import { CycleDetail, CycleDetailSpec } from '../types/cycle';
import { WorkDetail, WorkSumary, WorkSumarySpec } from '../types/work';
import { PostDetail } from '../types/post';

export const find = async (props: Prisma.UserFindUniqueArgs,language?:string): Promise<UserDetail | null> => {
  const { select = undefined, include = true,where } = props;
  const user = await prisma.user.findFirst({
    where,
    include: UserDetailSpec,
  });
  // user.favWorks.forEach((w:any)=>{
  //   w.currentUserIsFav = true
  // })
  return user;
};

export const findSumary = async (id:number,language?:string): Promise<UserSumary | null> => {
  const user = await prisma.user.findFirst({
    where:{id},
    select: UserSumarySpec,
  });
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
    include: UserDetailSpec
  });
  return users;
};

export const findAllSumary = async (props?:Prisma.UserFindManyArgs): Promise<UserSumary[]> => {
  const {where,take,skip,cursor} = props||{};
  const users =await prisma.user.findMany({
    take,
    skip,
    cursor,
    ...(where && { where }),
    orderBy: { createdAt: 'desc' },
    select: UserSumarySpec
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
      joinedCycles:{select:CycleDetailSpec}
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
      cycles:{select:CycleDetailSpec}
    }
  });
  
  return res?.cycles.map((c:Partial<CycleDetail>)=>{
    c.type='cycle';
    return c as CycleDetail;
  })
  ??[];
};
export const postsCreated = async (id:number,lang?:string): Promise<PostDetail[]> => {
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
  
  return res?.posts.map((p:Partial<PostDetail>)=>{
    p.type='post';
    return p as PostDetail;
  })
  ??[];
};
export const favPosts = async (id:number,lang?:string): Promise<PostDetail[]> => {
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
  
  return res?.favPosts.map((p:Partial<PostDetail>)=>{
    p.type='post';
    return p as PostDetail;
  })
  ??[];
};
export const favCycles = async (id:number,lang?:string): Promise<CycleDetail[]> => {
  let res = await prisma.user.findFirst({
    where:{id},
    select: {
      favCycles:{
        select:CycleDetailSpec
      }
    }
  });
  
  return res?.favCycles.map((p:Partial<CycleDetail>)=>{
    p.type='cycle';
    return p as CycleDetail;
  })
  ??[];
};
export const favWorks = async (id:number,lang?:string): Promise<WorkSumary[]> => {
  let res = await prisma.user.findFirst({
    where:{id},
    select: {
      favWorks:{select:WorkSumarySpec}
    }
  });
  
  return res?.favWorks??[];
};

export const readOrWatchedWorks = async (id:number):Promise<{work:WorkSumary|null,year:any}[]> => {
  let res = await prisma.user.findFirst({
    where:{id},
    select:{
      readOrWatchedWorks:{
        select:{
          work:{select:WorkSumarySpec},
          year:true
        }
      }
    }
  });
  return res?.readOrWatchedWorks!;
}

