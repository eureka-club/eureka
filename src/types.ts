import { User } from '@prisma/client';

import { CycleWithImages } from './types/cycle';
import { WorkWithImages } from './types/work';
import { PostMosaicItem, PostWithImages } from './types/post';

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

export type MosaicItem = CycleWithImages | PostMosaicItem | WorkWithImages;
export type SearchResult = CycleWithImages | PostWithImages | WorkWithImages;

export const isCycle = (obj: MosaicItem | SearchResult): obj is CycleWithImages =>
  typeof (obj as CycleWithImages).title === 'string' &&
  typeof (obj as CycleWithImages).startDate === 'string' &&
  typeof (obj as CycleWithImages).endDate === 'string';
export const isPost = (obj: MosaicItem): obj is PostMosaicItem =>
  typeof (obj as PostMosaicItem).title === 'string' &&
  typeof (obj as PostMosaicItem).creator === 'object' &&
  typeof (obj as PostMosaicItem).works === 'object' &&
  typeof (obj as PostMosaicItem).language === 'string';
export const isWork = (obj: MosaicItem | SearchResult): obj is WorkWithImages =>
  typeof (obj as WorkWithImages).title === 'string' &&
  typeof (obj as WorkWithImages).author === 'string' &&
  typeof (obj as WorkWithImages).type === 'string';
