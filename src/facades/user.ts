import { Prisma, User } from '@prisma/client';
import { UserDetailSpec, UserMosaicItem } from '@/types/user';
// import { UserDetail } from '../types/user';
import {prisma} from '@/src/lib/prisma';

export const find = async (props: Prisma.UserFindUniqueArgs,language?:string): Promise<UserMosaicItem | null> => {
  const { select = undefined, include = true,where } = props;
  const user: any = await prisma.user.findFirst({
    where,
    select:UserDetailSpec
  });
  user.favWorks.forEach((w:any)=>{
    w.currentUserIsFav = true
  })
  return user;
};

export const findAll = async (props?:Prisma.UserFindManyArgs): Promise<UserMosaicItem[]> => {
  const {where,take,skip,cursor} = props||{};
  return prisma.user.findMany({
    take,
    skip,
    cursor,
    ...(where && { where }),
    orderBy: { createdAt: 'desc' },
    select: UserDetailSpec
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
