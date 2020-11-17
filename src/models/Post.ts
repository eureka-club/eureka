import { CreatorDbObject } from './User';
import { LocalImageDbObject } from './LocalImage';
import { WorkDbObject } from './Work';

export const TABLE_NAME = 'post';

export const schema = (alias: string = TABLE_NAME): Record<string, string> => ({
  [`${alias}.id`]: `${TABLE_NAME}.id`,
  [`${alias}.content_text`]: `${TABLE_NAME}.content_text`,
  [`${alias}.created_at`]: `${TABLE_NAME}.created_at`,
  [`${alias}.updated_at`]: `${TABLE_NAME}.updated_at`,
});

export interface PostDbObject {
  'post.id': string;
  'post.content_text': string;
  'post.created_at': string;
  'post.updated_at': string;
}

export interface PostDetail extends PostDbObject, CreatorDbObject, LocalImageDbObject, WorkDbObject {}

export interface PostFullDetail extends PostDetail {
  'creator.avatar.file': string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any,  @typescript-eslint/explicit-module-boundary-types
export const isPostFullDetail = (object: any): object is PostFullDetail => object['creator.avatar.file'] != null;
