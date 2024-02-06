import { Prisma, Edition } from '@prisma/client';
import { StoredFileUpload } from '../types';
import { CreateEditionServerPayload, EditEditionPayload, EditionDetail, EditionDetailSpec } from '../types/edition';
import { prisma } from '@/src/lib/prisma';

export const find = async (id: number): Promise<EditionDetail | null> => {
  return prisma.edition.findUnique({
    where: { id },
    include: EditionDetailSpec
  });
};

export const findAll = async (props?: Prisma.EditionFindManyArgs): Promise<EditionDetail[]> => {
  const { where, include = null, take, skip, cursor } = props || {};
  return prisma.edition.findMany({
    take,
    skip,
    cursor,
    orderBy: { createdAt: 'desc' },
    include: EditionDetailSpec,
    where,
  });
};

export const findAllByWork = async (workId:number): Promise<EditionDetail[]> => {
  return prisma.edition.findMany({
    orderBy: { createdAt: 'desc' },
    include: EditionDetailSpec,
    where:{workId},
  });
};

export const deleteAllByWork = async (workId:number): Promise<void> => {
  await prisma.edition.deleteMany({
    where:{workId},
  });
};


export const createFromServerFields = async (
  payload: Partial<CreateEditionServerPayload>,
  coverImageUpload?:StoredFileUpload
): Promise<Edition> => {

  let o = {...payload};
  let creatorId = o.creatorId;
  let workId = o.workId;
  let localImages:any ;

  if(coverImageUpload){
    const existingLocalImage = await prisma.localImage.findFirst({
      where: { contentHash: coverImageUpload.contentHash },
    });

    localImages = !existingLocalImage
      ? {
        create: { ...coverImageUpload },
      }
      : {
        connect: {
          id: existingLocalImage.id,
        },
      };
  }
  else{
    localImages = {
      connect:o.localImages
    };
  }

  delete o.localImages;
  delete o.creatorId;
  delete o.workId;

  let data:Prisma.EditionCreateInput = {
    ... o as CreateEditionServerPayload,
    localImages,
    work:{connect:{id:workId}},
    creator:{connect:{id:creatorId}}
  };
  return prisma.edition.create({data});
};

export const updateFromServerFields = async (
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
