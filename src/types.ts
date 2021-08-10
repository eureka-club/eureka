import { Cycle, Post, User, Work } from '@prisma/client';

import { CycleMosaicItem, CycleWithImages } from './types/cycle';
import { PostMosaicItem, PostWithImages } from './types/post';
import { WorkMosaicItem, WorkWithImages } from './types/work';
import { UserMosaicItem } from './types/user';

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
  readOrWatchedByMe?: boolean | undefined;
}

/*
 * TS type guards
 */

export type BasicEntity = Cycle | Post | Work | User;
export type MosaicItem = CycleMosaicItem | PostMosaicItem | WorkMosaicItem | UserMosaicItem;
export type SearchResult = CycleWithImages | PostWithImages | WorkWithImages | UserMosaicItem;

export const isCycle = (obj: BasicEntity): obj is Cycle =>
  typeof (obj as Cycle).title === 'string' &&
  (obj as CycleMosaicItem).startDate !== undefined &&
  (obj as CycleMosaicItem).endDate !== undefined;
export const isPost = (obj: BasicEntity): obj is Post =>
  typeof (obj as Post).title === 'string' &&
  typeof (obj as Post).creatorId === 'number' &&
  typeof (obj as Post).language === 'string';
export const isWork = (obj: BasicEntity): obj is Work =>
  typeof (obj as Work).title === 'string' &&
  typeof (obj as Work).author === 'string' &&
  typeof (obj as Work).type === 'string';

export const isUser = (obj: BasicEntity): obj is User =>
  typeof (obj as User).roles === 'string' && typeof (obj as User).email === 'string';

// TODO separate type-guards for MosaicItem and SearchResult
export const isCycleMosaicItem = (obj: MosaicItem | SearchResult): obj is CycleMosaicItem =>
  typeof (obj as CycleMosaicItem).title === 'string' &&
  (obj as CycleMosaicItem).startDate !== undefined &&
  (obj as CycleMosaicItem).endDate !== undefined;
export const isPostMosaicItem = (obj: MosaicItem | SearchResult): obj is PostMosaicItem =>
  typeof (obj as PostMosaicItem).title === 'string' &&
  typeof (obj as PostMosaicItem).creatorId === 'object' &&
  typeof (obj as PostMosaicItem).works === 'object' &&
  typeof (obj as PostMosaicItem).language === 'string';
export const isWorkMosaicItem = (obj: MosaicItem | SearchResult): obj is WorkMosaicItem =>
  typeof (obj as WorkMosaicItem).title === 'string' &&
  typeof (obj as WorkMosaicItem).author === 'string' &&
  typeof (obj as WorkMosaicItem).type === 'string';

export const isUserMosaicItem = (obj: MosaicItem | SearchResult): obj is UserMosaicItem =>
  typeof (obj as UserMosaicItem).roles === 'string' && typeof (obj as UserMosaicItem).email === 'string';
