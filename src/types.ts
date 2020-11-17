import { PostDbObject } from './models/Post';
import { CreatorDbObject } from './models/User';
import { LocalImageDbObject } from './models/LocalImage';
import { WorkDbObject } from './models/Work';

export interface CycleObject {
  kind: 'cycle';
  id: string;
  title: string;
  image: string;
  startDate: string;
  endDate: string;
  bookmarked?: boolean;
  liked?: boolean;
}

export interface PostDetail extends PostDbObject, CreatorDbObject, LocalImageDbObject, WorkDbObject {}

export interface PostFullDetail extends PostDetail {
  'creator.avatar.file': string;
}

export interface WorkDetail extends WorkDbObject, PostDbObject, LocalImageDbObject {}

export type MosaicItem = PostDetail;

export const isPostObject = (object: MosaicItem): object is PostDetail => object['post.id'] != null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any,  @typescript-eslint/explicit-module-boundary-types
export const isPostFullDetail = (object: any): object is PostFullDetail => object['creator.avatar.file'] != null;
