import { Cycle, Post, User, Work } from '@prisma/client';

import { StoredFileUpload } from '../types';
import { CreatePostServerFields, CreatePostServerPayload, PostWithImages, PostWithCyclesWorks } from '../types/post';
import prisma from '../lib/prisma';

export const find = async (id: number): Promise<PostWithCyclesWorks | null> => {
  return prisma.post.findUnique({
    where: { id },
    include: {
      cycles: true,
      works: true,
    },
  });
};

export const findAll = async (): Promise<PostWithImages[]> => {
  return prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: { localImages: true },
  });
};

export const createFromServerFields = async (
  fields: CreatePostServerFields,
  coverImageUpload: StoredFileUpload,
  creator: User,
): Promise<Post> => {
  const payload = Object.entries(fields).reduce((memo, [fieldName, fieldValues]) => {
    switch (fieldName) {
      case 'selectedCycleId':
      case 'selectedWorkId':
        return { ...memo, [fieldName]: Number(fieldValues[0]) };
      case 'isPublic':
        return { ...memo, [fieldName]: fieldValues[0] === 'true' };
      default:
        return { ...memo, [fieldName]: fieldValues[0] };
    }
  }, {} as CreatePostServerPayload);

  let existingCycle: Cycle | null = null;
  if (payload.selectedCycleId != null) {
    existingCycle = await prisma.cycle.findUnique({ where: { id: payload.selectedCycleId } });
    if (existingCycle == null) {
      throw new Error('[412] Invalid Cycle ID provided');
    }
  }

  let existingWork: Work | null = null;
  if (payload.selectedWorkId != null) {
    existingWork = await prisma.work.findUnique({ where: { id: payload.selectedWorkId } });
    if (existingWork == null) {
      throw new Error('[412] Invalid Work ID provided');
    }
  }

  const existingLocalImage = await prisma.localImage.findFirst({
    where: { contentHash: coverImageUpload.contentHash },
  });

  return prisma.post.create({
    data: {
      title: payload.title,
      ...(payload.contentText != null && { contentText: payload.contentText }),
      language: payload.language,
      isPublic: payload.isPublic,
      creator: { connect: { id: creator.id } },
      localImages: {
        connectOrCreate: {
          where: { id: existingLocalImage != null ? existingLocalImage.id : 0 },
          create: { ...coverImageUpload },
        },
      },
      ...(existingCycle != null && { cycles: { connect: { id: existingCycle.id } } }),
      ...(existingWork != null && { works: { connect: { id: existingWork.id } } }),
    },
  });
};

export const remove = async (post: PostWithCyclesWorks): Promise<Post> => {
  if (post.cycles.length) {
    await prisma.post.update({
      where: { id: post.id },
      data: {
        cycles: {
          disconnect: post.cycles.map((cycle) => ({
            id: cycle.id,
          })),
        },
      },
    });
  }

  if (post.works.length) {
    await prisma.post.update({
      where: { id: post.id },
      data: {
        works: {
          disconnect: post.works.map((work) => ({
            id: work.id,
          })),
        },
      },
    });
  }

  return prisma.post.delete({
    where: { id: post.id },
  });
};
