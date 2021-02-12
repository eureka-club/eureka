import { Cycle, LocalImage, Prisma, User } from '@prisma/client';

import { StoredFileUpload } from '../types';
import { CreateCycleServerFields, CreateCycleServerPayload } from '../types/cycle';
import prisma from '../lib/prisma';

export const find = async (
  id: number,
): Promise<Prisma.CycleGetPayload<{
  include: {
    creator: true;
    localImages: true;
  };
}> | null> => {
  return prisma.cycle.findUnique({
    where: { id },
    include: {
      creator: true,
      localImages: true,
    },
  });
};

export const findAll = async (): Promise<
  (Cycle & {
    localImages: LocalImage[];
  })[]
> => {
  return prisma.cycle.findMany({
    orderBy: { createdAt: 'desc' },
    include: { localImages: true },
  });
};

export const countPosts = async (
  cycle: Cycle,
): Promise<Prisma.GetPostAggregateType<{ count: true; where: { cycles: { some: { id: number } } } }>> => {
  return prisma.post.aggregate({
    count: true,
    where: { cycles: { some: { id: cycle.id } } },
  });
};

export const countWorks = async (
  cycle: Cycle,
): Promise<Prisma.GetWorkAggregateType<{ count: true; where: { cycles: { some: { id: number } } } }>> => {
  return prisma.work.aggregate({
    count: true,
    where: { cycles: { some: { id: cycle.id } } },
  });
};

export const search = async (
  searchText: string,
): Promise<
  (Cycle & {
    localImages: LocalImage[];
  })[]
> => {
  return prisma.cycle.findMany({
    include: { localImages: true },
    where: {
      title: { contains: searchText },
    },
  });
};

export const createFromServerFields = async (
  fields: CreateCycleServerFields,
  coverImageUpload: StoredFileUpload,
  creator: User,
): Promise<Cycle> => {
  const payload = Object.entries(fields).reduce((memo, field) => {
    const [fieldName, fieldValues] = field;

    switch (fieldName) {
      case 'includedWorksIds':
        return memo; // we don't want IDs of Works in Cycle payload

      case 'isPublic':
        return { ...memo, [fieldName]: fieldValues[0] === 'true' };

      case 'startDate':
      case 'endDate':
        return { ...memo, [fieldName]: new Date(fieldValues[0]) };

      default:
        return { ...memo, [fieldName]: fieldValues[0] };
    }
  }, {} as CreateCycleServerPayload);

  const existingLocalImage = await prisma.localImage.findFirst({
    where: { contentHash: coverImageUpload.contentHash },
  });

  if (existingLocalImage != null) {
    return prisma.cycle.create({
      data: {
        ...payload,
        creator: { connect: { id: creator.id } },
        works: { connect: fields.includedWorksIds.map((id) => ({ id: parseInt(id, 10) })) },
        localImages: { connect: { id: existingLocalImage.id } },
      },
    });
  }

  return prisma.cycle.create({
    data: {
      ...payload,
      creator: { connect: { id: creator.id } },
      works: { connect: fields.includedWorksIds.map((id) => ({ id: parseInt(id, 10) })) },
      localImages: {
        create: { ...coverImageUpload },
      },
    },
  });
};

export const remove = async (id: number): Promise<Cycle> => {
  return prisma.cycle.delete({
    where: { id },
  });
};
