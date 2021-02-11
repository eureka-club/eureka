import { Work } from '@prisma/client';

import { StoredFileUpload } from '../types';
import { CreateWorkServerFields, CreateWorkServerPayload, WorkWithImages } from '../types/work';
import prisma from '../lib/prisma';

export const find = async (id: number): Promise<WorkWithImages | null> => {
  return prisma.work.findUnique({
    where: { id },
    include: { localImages: true },
  });
};

export const findAll = async (): Promise<WorkWithImages[]> => {
  return prisma.work.findMany({
    orderBy: { createdAt: 'desc' },
    include: { localImages: true },
  });
};

export const search = async (searchText: string): Promise<WorkWithImages[]> => {
  return prisma.work.findMany({
    where: {
      OR: [{ title: { contains: searchText } }, { author: { contains: searchText } }],
    },
    include: { localImages: true },
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
