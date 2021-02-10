import { Cycle, Post, User, Work } from '@prisma/client';

import { StoredFileUpload } from '../types';
import { CreatePostServerFields, CreatePostServerPayload } from '../types/post';
import prisma from '../lib/prisma';

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
