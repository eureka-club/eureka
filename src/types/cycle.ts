import { Cycle, LocalImage, Prisma } from '@prisma/client';

export interface ComplementaryMaterial {
  author: string;
  title: string;
  publicationDate: Date;
  link: string | null;
  file: File | null;
}

export interface CycleWithImages extends Cycle {
  localImages: LocalImage[];    
}

export type CycleMosaicItem = Prisma.CycleGetPayload<{
  include: {
    localImages: true;
  };
}>;

export type CycleDetail = Prisma.CycleGetPayload<{
  include: {
    creator: true;
    localImages: true;
    complementaryMaterials: true;
    participants: true;
    likes: true;
    favs: true;
  };
}>;

export interface CreateCycleClientPayload {
  includedWorksIds: number[];
  coverImage: File;
  isPublic: boolean;
  title: string;
  languages: string;
  startDate: string;
  endDate: string;
  contentText: string;
  complementaryMaterials: ComplementaryMaterial[];
}

export interface CreateCycleServerFields {
  includedWorksIds: string[];
  isPublic: boolean[];
  title: string[];
  languages: string[];
  startDate: string[];
  endDate: string[];
  contentText: string[];
}

export interface CreateCycleServerPayload {
  isPublic: boolean;
  title: string;
  languages: string;
  contentText: string;
  startDate: Date;
  endDate: Date;
}
