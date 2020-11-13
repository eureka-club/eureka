import Knex from 'knex';

import { createFindFn, createFindAllFn } from '../lib/db';
import { TABLE_NAME as POST_TABLE_NAME, schema as postSchema } from '../models/Post';
import { TABLE_NAME as LOCAL_IMAGE_TABLE_NAME, schema as localImageSchema } from '../models/LocalImage';
import { TABLE_NAME as WORK_TABLE_NAME, schema as workSchema } from '../models/Work';
import { schema as userSchema, TABLE_NAME as USER_TABLE_NAME } from '../models/User';

export const fetchDetailPost = async (id: string): Promise<Knex.QueryBuilder> => {
  const findFn = createFindFn(
    POST_TABLE_NAME,
    (table: Knex.QueryBuilder): Knex.QueryBuilder => {
      return table.select({
        ...postSchema(POST_TABLE_NAME),
        ...userSchema('creator'),
        ...localImageSchema(LOCAL_IMAGE_TABLE_NAME),
        ...workSchema(WORK_TABLE_NAME),
      });
    },
  );

  return findFn(id, [{ table: USER_TABLE_NAME, alias: 'creator' }, LOCAL_IMAGE_TABLE_NAME, WORK_TABLE_NAME]);
};

export const fetchFullPostDetail = async (id: string): Promise<Knex.QueryBuilder> => {
  return createFindFn(POST_TABLE_NAME, (table) => {
    table.leftJoin('user_image', 'user.id', '=', 'user_image.user_id');
    table.leftJoin({ avatar: 'local_image' }, 'user_image.local_image_id', '=', 'avatar.id');

    return table.select({
      ...postSchema(POST_TABLE_NAME),
      ...userSchema('creator'),
      ...{ 'creator.avatar.file': 'avatar.stored_file' },
      ...localImageSchema(LOCAL_IMAGE_TABLE_NAME),
      ...workSchema(WORK_TABLE_NAME),
    });
  })(id, [{ table: USER_TABLE_NAME, alias: 'creator' }, LOCAL_IMAGE_TABLE_NAME, WORK_TABLE_NAME]);
};

export const fetchIndexMosaic = async (): Promise<Knex.QueryBuilder> => {
  const findFn = createFindAllFn(
    POST_TABLE_NAME,
    (table: Knex.QueryBuilder): Knex.QueryBuilder => {
      return table.select({
        ...postSchema(POST_TABLE_NAME),
        ...userSchema('creator'),
        ...localImageSchema(LOCAL_IMAGE_TABLE_NAME),
        ...workSchema(WORK_TABLE_NAME),
      });
    },
  );

  return findFn([{ table: USER_TABLE_NAME, alias: 'creator' }, LOCAL_IMAGE_TABLE_NAME, WORK_TABLE_NAME], {
    'post.created_at': 'DESC',
  });
};
