import { User as PrismaUser } from '@prisma/client';

import { PostDbObject } from './models/Post';
import { CreatorDbObject } from './models/User';
import { CycleDbObject } from './models/Cycle';
import { LocalImageDbObject } from './models/LocalImage';
import { WorkDbObject } from './models/Work';

export interface FileUpload {
  fieldName: string;
  originalFilename: string;
  path: string;
  headers: Record<string, string>;
  size: number;
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

export interface User {
  id: number;
  name: string;
  email: string;
  image: string;
}

export interface Session {
  accessToken?: string;
  expires: string;
  user: PrismaUser;
}

export interface CycleDetail extends CycleDbObject, CreatorDbObject {}

export interface CyclePoster {
  name: string;
  image: string;
}

export interface PostDetail extends PostDbObject, CreatorDbObject, LocalImageDbObject, WorkDbObject, CycleDbObject {}

export interface WorkDetail extends WorkDbObject, PostDbObject, LocalImageDbObject {}

export type MosaicItem = PostDbObject & LocalImageDbObject & WorkDbObject & CycleDbObject;

export const isCycleCover = (object: MosaicItem): object is MosaicItem => object['cycle.is_cover'];
