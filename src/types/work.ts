import { Prisma } from '@prisma/client';

// export type WorkDetail = Prisma.WorkGetPayload<{
//   include: {
//     localImages: true;
//     favs: true;
//     ratings: true;
//   };
// }>;

export type WorkWithImages = Prisma.WorkGetPayload<{
  include: {
    localImages: {select:{storedFile:true}}
  };
}>;

export type WorkMosaicItem = Prisma.WorkGetPayload<{
  include:{
    localImages: {select:{storedFile:true}};
    _count:{select:{ratings:true}};
    favs:{select:{id:true}},
    ratings: {select:{userId:true,qty:true}};
  }
}> & {
  currentUserRating?:number;
  ratingCount?:number;
  ratingAVG?:number;
};

export interface CreateWorkClientPayload {
  cover: File;
  type: string;
  title: string;
  author: string;
  authorGender: string | null;
  authorRace: string | null;
  contentText: string | null;
  link: string | null;
  countryOfOrigin: string | null;
  countryOfOrigin2: string | null;
  publicationYear: string | null;
  length: string | null;
  tags: string;
  topics: string;
}

export interface CreateWorkServerFields {
  type: string[];
  title: string[];
  author: string[];
  authorGender?: string[];
  authorRace?: string[];
  contentText?: string[];
  link?: string[];
  countryOfOrigin?: string[];
  countryOfOrigin2?: string[];
  publicationYear?: string[];
  length?: string[];
  tags: string;
  topics: string;
  creatorId: number;
}

export interface CreateWorkServerPayload {
  type: string;
  title: string;
  author: string;
  authorGender?: string;
  authorRace?: string;
  contentText?: string;
  link?: string;
  countryOfOrigin?: string;
  countryOfOrigin2?: string;
  publicationYear?: Date;
  length?: string;
  tags: string;
  topics: string;
  creatorId: number;
}

export interface EditWorkClientPayload {
  // cover: File;
  id: string;
  type?: string;
  title?: string;
  author?: string;
  authorGender?: string | null;
  authorRace?: string | null;
  contentText?: string | null;
  link?: string | null;
  countryOfOrigin?: string | null;
  countryOfOrigin2?: string | null;
  publicationYear?: string | null;
  length?: string | null;
  tags?: string;
  topics?: string;
}
