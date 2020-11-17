import { PostDetail } from './models/Post';

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

export type MosaicItem = PostDetail;

export const isPostObject = (object: MosaicItem): object is PostDetail => object['post.id'] != null;
