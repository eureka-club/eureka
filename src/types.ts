import { User } from '@prisma/client';

import { CycleWithImages } from './types/cycle';
import { WorkWithImages } from './types/work';
import { PostWithImages } from './types/post';

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
  user: User;
}

export interface StoredFileUpload {
  contentHash: string;
  originalFilename: string;
  storedFile: string;
  mimeType: string;
}

/*
 * TS type guards
 */

export type MosaicItem = CycleWithImages | PostWithImages | WorkWithImages;
export type SearchResult = CycleWithImages | PostWithImages | WorkWithImages;

export const isCycle = (obj: MosaicItem | SearchResult): obj is CycleWithImages =>
  typeof (obj as CycleWithImages).title === 'string' &&
  typeof (obj as CycleWithImages).startDate === 'string' &&
  typeof (obj as CycleWithImages).endDate === 'string';
export const isPost = (obj: MosaicItem | SearchResult): obj is PostWithImages =>
  typeof (obj as PostWithImages).title === 'string' &&
  typeof (obj as PostWithImages).creatorId === 'number' &&
  typeof (obj as PostWithImages).language === 'string';
export const isWork = (obj: MosaicItem | SearchResult): obj is WorkWithImages =>
  typeof (obj as WorkWithImages).title === 'string' &&
  typeof (obj as WorkWithImages).author === 'string' &&
  typeof (obj as WorkWithImages).type === 'string';
