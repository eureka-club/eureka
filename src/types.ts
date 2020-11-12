import { PostDbObject } from './models/Post';

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

export type MosaicItem = PostDbObject;

export const isPostObject = (object: MosaicItem): object is PostDbObject => object['post.id'] != null;
