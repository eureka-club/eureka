import { User } from '@prisma/client';

import { CycleMosaicItem, CycleWithImages } from './types/cycle';
import { PostMosaicItem, PostWithImages } from './types/post';
import { WorkMosaicItem, WorkWithImages } from './types/work';

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

export type MosaicItem = CycleMosaicItem | PostMosaicItem | WorkMosaicItem;
export type SearchResult = CycleWithImages | PostWithImages | WorkWithImages;

// TODO separate type-guard fns for Mosaic & Search
export const isCycle = (obj: MosaicItem | SearchResult): obj is CycleMosaicItem =>
  typeof (obj as CycleMosaicItem).title === 'string' &&
  typeof (obj as CycleMosaicItem).startDate === 'string' &&
  typeof (obj as CycleMosaicItem).endDate === 'string';
export const isPost = (obj: MosaicItem | SearchResult): obj is PostMosaicItem =>
  typeof (obj as PostMosaicItem).title === 'string' &&
  typeof (obj as PostMosaicItem).creator === 'object' &&
  typeof (obj as PostMosaicItem).works === 'object' &&
  typeof (obj as PostMosaicItem).language === 'string';
export const isWork = (obj: MosaicItem | SearchResult): obj is WorkMosaicItem =>
  typeof (obj as WorkMosaicItem).title === 'string' &&
  typeof (obj as WorkMosaicItem).author === 'string' &&
  typeof (obj as WorkMosaicItem).type === 'string';
