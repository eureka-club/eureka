import { Term } from '@prisma/client';
// import { CreateWorkServerFields, CreateWorkServerPayload, WorkDetail, WorkWithImages } from '../types/term';
import {prisma} from '@/src/lib/prisma';

/* export const find = async (id: number): Promise<Prisma.TermGetPayload | null> => {
  return prisma.term.findUnique({
    where: { id },
    include: {
      localImages: true,
      likes: true,
      favs: true,
    },
  });
};

export const findAll = async (): Promise<WorkWithImages[]> => {
  return prisma.term.findMany({
    orderBy: { createdAt: 'desc' },
    include: { localImages: true, likes: true, favs: true },
  });
}; */

export const search = async (taxonomy: number, query: { [key: string]: string | string[] }): Promise<Term[]> => {
  const { q, where, include } = query;
  if (where == null && q == null) {
    throw new Error("[412] Invalid invocation! Either 'q' or 'where' query parameter must be provided");
  }

  if (typeof q === 'string') {
    return prisma.term.findMany({
      where: {
        OR: [{ label: { contains: q } }, { code: { contains: q } }],
      },
      ...(typeof include === 'string' && { include: JSON.parse(include) }),
    });
  }

  return prisma.term.findMany({
    ...(typeof where === 'string' && { where: JSON.parse(where) }),
    ...(typeof include === 'string' && { include: JSON.parse(include) }),
  });
};

export const remove = async (id: number): Promise<Term> => {
  return prisma.term.delete({
    where: { id },
  });
};
