import { Prisma } from '@prisma/client';

export type WorkDetail = Prisma.WorkGetPayload<{
  include: {
    localImages: true;
    likes: true;
    favs: true;
  };
}>;

export type WorkWithImages = Prisma.WorkGetPayload<{
  include: {
    localImages: true;
  };
}>;

export type WorkMosaicItem = Prisma.WorkGetPayload<{
  include: {
    localImages: true;
    likes: true;
    favs: true;
  };
}>;

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
  publicationYear: string | null;
  length: string | null;
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
  publicationYear?: string[];
  length?: string[];
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
  publicationYear?: Date;
  length?: string;
}
