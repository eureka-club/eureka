import { User as PrismaUser, Prisma } from '@prisma/client';

export interface FileUpload {
  fieldName: string;
  originalFilename: string;
  path: string;
  headers: Record<string, string>;
  size: number;
}

export interface Session {
  accessToken?: string;
  expires: string;
  user: PrismaUser;
}

export interface StoredFileUpload {
  contentHash: string;
  originalFilename: string;
  storedFile: string;
  mimeType: string;
}

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

export type MosaicWork = Prisma.WorkGetPayload<{
  include: {
    localImages: true;
  };
}>;

export type MosaicItem = MosaicWork;

export const isMosaicWork = (obj: MosaicItem): obj is MosaicWork =>
  typeof obj.type === 'string' && typeof obj.title === 'string' && typeof obj.author === 'string';
