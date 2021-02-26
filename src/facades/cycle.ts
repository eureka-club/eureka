import { Cycle, CycleComplementaryMaterial, LocalImage, Prisma, User } from '@prisma/client';

import { StoredFileUpload } from '../types';
import { CreateCycleServerFields, CreateCycleServerPayload, CycleDetail } from '../types/cycle';
import prisma from '../lib/prisma';

export const find = async (id: number): Promise<CycleDetail | null> => {
  return prisma.cycle.findUnique({
    where: { id },
    include: {
      creator: true,
      localImages: true,
      complementaryMaterials: true,
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

export const findParticipant = async (user: User, cycle: Cycle): Promise<User | null> => {
  return prisma.user.findFirst({
    where: {
      id: user.id,
      joinedCycles: { some: { id: cycle.id } },
    },
  });
};

export const countParticipants = async (
  cycle: Cycle,
): Promise<Prisma.GetUserAggregateType<{ count: true; where: { cycles: { some: { id: number } } } }>> => {
  return prisma.user.aggregate({
    count: true,
    where: { joinedCycles: { some: { id: cycle.id } } },
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

export const search = async (query: { [key: string]: string | string[] }): Promise<Cycle[]> => {
  const { q, where, include } = query;
  if (where == null && q == null) {
    throw new Error("[412] Invalid invocation! Either 'q' or 'where' query parameter must be provided");
  }

  if (typeof q === 'string') {
    return prisma.cycle.findMany({
      where: { title: { contains: q } },
      ...(typeof include === 'string' && { include: JSON.parse(include) }),
    });
  }

  return prisma.cycle.findMany({
    ...(typeof where === 'string' && { where: JSON.parse(where) }),
    ...(typeof include === 'string' && { include: JSON.parse(include) }),
  });
};

export const createFromServerFields = async (
  creator: User,
  fields: CreateCycleServerFields,
  coverImageUpload: StoredFileUpload,
  complementaryMaterialsUploadData: Record<string, StoredFileUpload>,
): Promise<Cycle> => {
  const payload = Object.entries(fields)
    .filter(([fieldName]) => !fieldName.match(/CM\d_/))
    .reduce((memo, field) => {
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
  const complementaryMaterialsPayload = Object.entries(fields)
    .filter(([fieldName]) => fieldName.match(/CM\d_/))
    .reduce((memo, [cmFieldName, value]) => {
      const m = cmFieldName.match(/CM(\d)_(\w+)/);
      if (m == null) return memo;

      const idx = Number(m[1]);
      const fieldName = m[2];

      if (memo[idx] == null) {
        // @ts-ignore
        memo[idx] = {}; // eslint-disable-line no-param-reassign
      }

      switch (fieldName) {
        case 'publicationDate':
          memo[idx] = { ...memo[idx], [fieldName]: new Date(value[0]) }; // eslint-disable-line no-param-reassign
          break;
        default:
          memo[idx] = { ...memo[idx], [fieldName]: value[0] }; // eslint-disable-line no-param-reassign
          break;
      }

      if (complementaryMaterialsUploadData[`CM${idx}_file`] != null) {
        // eslint-disable-next-line no-param-reassign
        memo[idx] = { ...memo[idx], ...complementaryMaterialsUploadData[`CM${idx}_file`] };
      }

      return memo;
    }, [] as CycleComplementaryMaterial[]);

  const existingLocalImage = await prisma.localImage.findFirst({
    where: { contentHash: coverImageUpload.contentHash },
  });

  return prisma.cycle.create({
    data: {
      ...payload,
      creator: { connect: { id: creator.id } },
      works: { connect: fields.includedWorksIds.map((id) => ({ id: parseInt(id, 10) })) },
      complementaryMaterials: { create: complementaryMaterialsPayload },
      localImages: {
        connectOrCreate: {
          where: { id: existingLocalImage != null ? existingLocalImage.id : 0 },
          create: { ...coverImageUpload },
        },
      },
    },
  });
};

export const addParticipant = async (cycle: Cycle, user: User): Promise<Cycle> => {
  return prisma.cycle.update({
    where: { id: cycle.id },
    data: { participants: { connect: { id: user.id } } },
  });
};

export const removeParticipant = async (cycle: Cycle, user: User): Promise<Cycle> => {
  return prisma.cycle.update({
    where: { id: cycle.id },
    data: { participants: { disconnect: { id: user.id } } },
  });
};

export const remove = async (cycle: Cycle): Promise<Cycle> => {
  await prisma.cycle.update({
    where: { id: cycle.id },
    data: {
      complementaryMaterials: { deleteMany: { cycleId: cycle.id } },
      participants: { set: [] },
    },
    include: {
      complementaryMaterials: true,
      participants: true,
    },
  });

  return prisma.cycle.delete({
    where: { id: cycle.id },
  });
};
