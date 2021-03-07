import { Cycle, Work, Post, Prisma, User } from '@prisma/client';

import prisma from '../lib/prisma';


export const findAction = async (
  user: User, level: any, level_name: string, action: string): Promise<User | null> => {
  return prisma.user.count({
    where: {
      id: user.id,
      [`${action}${level_name}s`]: { some: { id: [level].id } },
    },
  });
};


export const updateAction = async (
  cycle: Cycle, user: User, action: string, is_add: boolean): Promise<Cycle> => {
  return prisma.cycle.update({
    where: { id: cycle.id },
    data: { [action]: { [(is_add ? 'connect': 'disconnect')]: { id: user.id } } },
  });
};