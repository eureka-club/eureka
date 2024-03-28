import { Prisma, User } from '@prisma/client';
import { UserDetailSpec, UserDetail } from '@/types/user';
// import { UserDetail } from '../types/user';
import {prisma} from '@/src/lib/prisma';
import { UserSumary, UserSumarySpec } from '../types/UserSumary';

export const find = async (props: Prisma.UserFindUniqueArgs,language?:string): Promise<UserDetail | null> => {
  const { select = undefined, include = true,where } = props;
  const readOrWatchedWorks = UserDetailSpec.include.readOrWatchedWorks;
  const user: any = await prisma.user.findFirst({
    where,
    include:{
      ...UserDetailSpec.include,
      readOrWatchedWorks: {
        ...readOrWatchedWorks,
        distinct:['workId']
      }
    },
  });
  user.favWorks.forEach((w:any)=>{
    w.currentUserIsFav = true
  })
  return user;
};

export const findSumary = async (id:number,language?:string): Promise<UserDetail | null> => {
  const user: any = await prisma.user.findFirst({
    where:{id},
    select:UserSumarySpec.select
  });
  return user;
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
