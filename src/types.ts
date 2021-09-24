import { Cycle, Post, User, Work, Comment } from '@prisma/client';

import { CycleMosaicItem } from './types/cycle';
import { PostMosaicItem } from './types/post';
import { WorkMosaicItem } from './types/work';
import { UserMosaicItem } from './types/user';
import { CommentMosaicItem } from './types/comment';

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
  // likedByMe: boolean | undefined;
  // readOrWatchedByMe?: boolean | undefined;
  ratingByMe?: boolean | undefined;
}

/*
 * TS type guards
 */

export type BasicEntity = Cycle | Post | Work | User | Comment;
export type MosaicItem = CycleMosaicItem | PostMosaicItem | WorkMosaicItem | UserMosaicItem | CommentMosaicItem;
export type SearchResult = CycleMosaicItem | PostMosaicItem | WorkMosaicItem;

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

export const isComment = (obj: BasicEntity): obj is Comment => 'commentId' in (obj as Comment);

// TODO separate type-guards for MosaicItem and SearchResult
export const isCycleMosaicItem = (obj: MosaicItem | SearchResult): obj is CycleMosaicItem =>
  typeof (obj as CycleMosaicItem).title === 'string' &&
  (obj as CycleMosaicItem).startDate !== undefined &&
  (obj as CycleMosaicItem).endDate !== undefined;
export const isWorkMosaicItem = (obj: MosaicItem | SearchResult): obj is WorkMosaicItem =>
  typeof (obj as WorkMosaicItem).title === 'string' &&
  // typeof (obj as WorkMosaicItem).author === 'string' &&
  typeof (obj as WorkMosaicItem).type === 'string' &&
  ['book', 'fiction-book', 'movie', 'documentary'].includes((obj as WorkMosaicItem).type);

export const isPostMosaicItem = (obj: MosaicItem | SearchResult): obj is PostMosaicItem => {
  return 'title' in obj && !isCycleMosaicItem(obj) && !isWorkMosaicItem(obj);
  // return (
  //   typeof (obj as PostMosaicItem).title === 'string' &&
  //   typeof (obj as PostMosaicItem).creatorId === 'number' &&
  //   typeof (obj as PostMosaicItem).works === 'object' &&
  //   typeof (obj as PostMosaicItem).language === 'string'
  // );
};

export const isUserMosaicItem = (obj: MosaicItem | SearchResult): obj is UserMosaicItem =>
  'email' in obj && 'countryOfOrigin' in obj && 'image' in obj;
