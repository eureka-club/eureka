import { Prisma, Work, User } from '@prisma/client';
import { StoredFileUpload } from '../types';
import { CreateWorkServerFields, CreateWorkServerPayload, WorkWithImages } from '../types/work';
import prisma from '../lib/prisma';

export const find = async (id: number): Promise<WorkWithImages | null> => {
  return prisma.work.findUnique({
    where: { id },
    include: {
      localImages: true,
      likes: true,
      favs: true,
    },
  });
};

export const findAll = async (): Promise<WorkWithImages[]> => {
  return prisma.work.findMany({
    orderBy: { createdAt: 'desc' },
    include: { localImages: true, likes: true, favs: true },
  });
};

export const findAction = async (user: User, work: Work, action: string): Promise<number> => {
  return prisma.user.count({
    where: {
      id: user.id,
      [`${action}Works`]: { some: { id: work.id } },
    },
  });
};

export const findLike = async (user: User, work: Work): Promise<User | null> => {
  return prisma.user.findFirst({
    where: {
      id: user.id,
      likedWorks: { some: { id: work.id } },
    },
  });
};

export const findFav = async (user: User, work: Work): Promise<User | null> => {
  return prisma.user.findFirst({
    where: {
      id: user.id,
      favWorks: { some: { id: work.id } },
    },
  });
};

export const search = async (query: { [key: string]: string | string[] }): Promise<Work[]> => {
  const { q, where, include } = query;
  if (where == null && q == null) {
    throw new Error("[412] Invalid invocation! Either 'q' or 'where' query parameter must be provided");
  }

  if (typeof q === 'string') {
    return prisma.work.findMany({
      where: {
        OR: [{ title: { contains: q } }, { author: { contains: q } }],
      },
      ...(typeof include === 'string' && { include: JSON.parse(include) }),
    });
  }

  return prisma.work.findMany({
    ...(typeof where === 'string' && { where: JSON.parse(where) }),
    ...(typeof include === 'string' && { include: JSON.parse(include) }),
  });
};

export const countCycles = async (
  work: Work,
): Promise<Prisma.GetCycleAggregateType<{ count: true; where: { works: { some: { id: number } } } }>> => {
  return prisma.cycle.aggregate({
    count: true,
    where: { works: { some: { id: work.id } } },
  });
};

export const countPosts = async (
  work: Work,
): Promise<Prisma.GetPostAggregateType<{ count: true; where: { works: { some: { id: number } } } }>> => {
  return prisma.post.aggregate({
    count: true,
    where: { works: { some: { id: work.id } } },
  });
};

export const createFromServerFields = async (
  fields: CreateWorkServerFields,
  coverImageUpload: StoredFileUpload,
): Promise<Work> => {
  const payload = Object.entries(fields).reduce((memo, field) => {
    const [fieldName, fieldValues] = field;

    if (fieldName === 'publicationYear') {
      return { ...memo, [fieldName]: new Date(fieldValues[0]) };
    }

    return { ...memo, [fieldName]: fieldValues[0] };
  }, {} as CreateWorkServerPayload);

  const existingLocalImage = await prisma.localImage.findFirst({
    where: { contentHash: coverImageUpload.contentHash },
  });

  if (existingLocalImage != null) {
    return prisma.work.create({
      data: {
        ...payload,
        localImages: {
          connect: {
            id: existingLocalImage.id,
          },
        },
      },
    });
  }

  return prisma.work.create({
    data: {
      ...payload,
      localImages: {
        create: { ...coverImageUpload },
      },
    },
  });
};

export const remove = async (id: number): Promise<Work> => {
  return prisma.work.delete({
    where: { id },
  });
};

export const updateAction = async (work: Work, user: User, action: string, isAdd: boolean): Promise<Work> => {
  return prisma.work.update({
    where: { id: work.id },
    data: { [action]: { [isAdd ? 'connect' : 'disconnect']: { id: user.id } } },
  });
};
