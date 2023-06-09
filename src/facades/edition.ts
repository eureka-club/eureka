import { Prisma, Edition } from '@prisma/client';
import { StoredFileUpload } from '../types';
import { CreateEditionPayload, EditEditionPayload, EditionMosaicItem } from '../types/edition';
import { prisma } from '@/src/lib/prisma';

export const find = async (id: number): Promise<EditionMosaicItem | null> => {
  return prisma.edition.findUnique({
    where: { id },
    include: {
      localImages: { select: { storedFile: true } },
    },
    
  });
};

export const findAll = async (props?: Prisma.EditionFindManyArgs): Promise<EditionMosaicItem[]> => {
  const { where, include = null, take, skip, cursor } = props || {};
  return prisma.edition.findMany({
    take,
    skip,
    cursor,
    orderBy: { createdAt: 'desc' },
    include: {
      localImages: { select: { storedFile: true } },
    },
    where,
  });
};

export const findAllByWork = async (workId:number): Promise<EditionMosaicItem[]> => {
  return prisma.edition.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      localImages: { select: { storedFile: true } },
    },
    where:{workId},
  });
};

export const deleteAllByWork = async (workId:number): Promise<void> => {
  await prisma.edition.deleteMany({
    where:{workId},
  });
};


export const createFromServerFields = async (
  payload: CreateEditionPayload,
  coverImageUpload: StoredFileUpload,
): Promise<Edition> => {

  const data = Object.entries(payload).reduce((memo,field)=>{
    const [fieldName, fieldValues] = field;
    if (fieldName === 'publicationYear') {
      return { ...memo, [fieldName]: new Date(fieldValues) };
    }
    return {...memo,[fieldName]:fieldValues};
  },{});

  const existingLocalImage = await prisma.localImage.findFirst({
    where: { contentHash: coverImageUpload.contentHash },
  });

  if (existingLocalImage != null) {
    return prisma.edition.create({
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

  return prisma.edition.create({
    data: {
      ...payload,
      localImages: {
        create: { ...coverImageUpload },
      },
    },
  });
};

export const UpdateFromServerFields = async (
  payload:EditEditionPayload,
  coverImageUpload: StoredFileUpload | null,
  id: number,
): Promise<Edition> => {
  
  const data = Object.entries(payload).reduce((memo,field)=>{
    const [fieldName, fieldValues] = field;
    if (fieldName === 'publicationYear') {
      return { ...memo, [fieldName]: new Date(fieldValues) };
    }
    return {...memo,[fieldName]:fieldValues};
  },{});

  // data.reduce((memo, field) => {
  //   const [fieldName, fieldValues] = field;

  //   if (fieldName === 'publicationYear') {
  //     return { ...memo, [fieldName]: new Date(fieldValues) };
  //   }

  //   return { ...memo, [fieldName]: fieldValues[0] };
  // }, {} as EditEditionPayload);

  const existingLocalImage = coverImageUpload 
    ? await prisma.localImage.findFirst({
        where: { contentHash: coverImageUpload.contentHash },
      })
    : null;

  if (existingLocalImage != null) {
     const q1 = prisma.edition.update({
       where: { id },
       data: {
         localImages: {
           set: [],
         },
       },
     });

     await prisma.$transaction([q1]);


    return prisma.edition.update({
      where: { id },
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

  if (coverImageUpload !== null && !existingLocalImage) {
    const q1 = prisma.edition.update({
      where: { id },
      data: {
        localImages: {
          set: [],
        },
      },
    });

    await prisma.$transaction([q1]);

    return prisma.edition.update({
      where: { id },
      data: {
        ...payload,
        localImages: {
          create: { ...coverImageUpload! },
        },
      },
    });
  }

  return prisma.edition.update({
    where: { id },
    data
  });
};

export const remove = async (id: number): Promise<Edition> => {
  return prisma.edition.delete({
    where: { id },
  });
};
