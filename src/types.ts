import { Cycle, Post, User, Work } from '@prisma/client';

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

export interface MySocialInfo {
  favoritedByMe: boolean | undefined;
  likedByMe: boolean | undefined;
}

/*
 * TS type guards
 */

export type BasicEntity = Cycle | Post | Work;
export type MosaicItem = CycleMosaicItem | PostMosaicItem | WorkMosaicItem;
export type SearchResult = CycleWithImages | PostWithImages | WorkWithImages;

export const isCycle = (obj: BasicEntity): obj is Cycle =>
  typeof (obj as Cycle).title === 'string' &&
  (obj as CycleMosaicItem).startDate !== undefined &&
  (obj as CycleMosaicItem).endDate !== undefined;
export const isPost = (obj: BasicEntity): obj is Post =>
  typeof (obj as Post).title === 'string' &&
  typeof (obj as Post).creatorId === 'object' &&
  typeof (obj as Post).language === 'string';
export const isWork = (obj: BasicEntity): obj is Work =>
  typeof (obj as Work).title === 'string' &&
  typeof (obj as Work).author === 'string' &&
  typeof (obj as Work).type === 'string';

// TODO separate type-guards for MosaicItem and SearchResult
export const isCycleMosaicItem = (obj: MosaicItem | SearchResult): obj is CycleMosaicItem =>
  typeof (obj as CycleMosaicItem).title === 'string' &&
  (obj as CycleMosaicItem).startDate !== undefined &&
  (obj as CycleMosaicItem).endDate !== undefined;
export const isPostMosaicItem = (obj: MosaicItem | SearchResult): obj is PostMosaicItem =>
  typeof (obj as PostMosaicItem).title === 'string' &&
  typeof (obj as PostMosaicItem).creator === 'object' &&
  typeof (obj as PostMosaicItem).works === 'object' &&
  typeof (obj as PostMosaicItem).language === 'string';
export const isWorkMosaicItem = (obj: MosaicItem | SearchResult): obj is WorkMosaicItem =>
  typeof (obj as WorkMosaicItem).title === 'string' &&
  typeof (obj as WorkMosaicItem).author === 'string' &&
  typeof (obj as WorkMosaicItem).type === 'string';
