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

export interface PostObject {
  kind: 'post';
  id: string;
  title: string;
  author: string;
  image: string;
  bookmarked?: boolean;
  liked?: boolean;
}

export type MosaicItem = CycleObject | PostObject;

export const isCycleObject = (object: MosaicItem): object is CycleObject => object.kind === 'cycle';

export const isPostObject = (object: MosaicItem): object is PostObject => object.kind === 'post';
