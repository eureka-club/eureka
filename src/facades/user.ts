import { Prisma, User } from '@prisma/client';
import { UserDetailSpec, UserDetail } from '@/types/user';
// import { UserDetail } from '../types/user';
import {prisma} from '@/src/lib/prisma';
import { UserSumary, UserSumarySpec } from '../types/UserSumary';
import redis from '@/src/lib/redis';
import { USER_SUMARY } from '../redis_keys';


export const find = async (props: Prisma.UserFindUniqueArgs,language?:string): Promise<UserDetail | null> => {
  const { select = undefined, include = true,where } = props;
  
  const user: any = await prisma.user.findFirst({
    where,
    include:UserDetailSpec.include
  });
  user.favWorks.forEach((w:any)=>{
    w.currentUserIsFav = true
  })
  return user;
};

export const findSumary = async (id:number,language?:string): Promise<UserSumary | null> => {
  const key=USER_SUMARY(id);
  const prev = await redis.get(key);
  if(prev)return JSON.parse(prev) as unknown as UserSumary;
  else{
    const user: any = await prisma.user.findFirst({
      where:{id},
      select:UserSumarySpec.select
    });
    await redis.set(key,JSON.stringify(user),'EX',60*60*24);
    return user;
  }
};

export const findAll = async (props?:Prisma.UserFindManyArgs): Promise<UserDetail[]> => {
  const {where,take,skip,cursor} = props||{};
  return prisma.user.findMany({
    take,
    skip,
    cursor,
    ...(where && { where }),
    orderBy: { createdAt: 'desc' },
    include: UserDetailSpec.include
  });
};

export const findAllSumary = async (props?:Prisma.UserFindManyArgs): Promise<UserSumary[]> => {
  const {where,take,skip,cursor} = props||{};
  return prisma.user.findMany({
    take,
    skip,
    cursor,
    ...(where && { where }),
    orderBy: { createdAt: 'desc' },
    select: UserSumarySpec.select
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
