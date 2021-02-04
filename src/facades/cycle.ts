import { Cycle, User } from '@prisma/client';

import { CreateCycleServerFields, CreateCycleServerPayload, StoredFileUpload } from '../types';
import prisma from '../lib/prisma';

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
