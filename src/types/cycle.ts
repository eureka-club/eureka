import { Cycle, LocalImage } from '@prisma/client';

export interface CycleWithImage extends Cycle {
  localImages: LocalImage[];
}

export interface CreateCycleClientPayload {
  includedWorksIds: number[];
  coverImage: File;
  isPublic: boolean;
  title: string;
  languages: string;
  startDate: string;
  endDate: string;
  contentText: string;
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
