import Knex from 'knex';

import { createFindFn, createFindAllFn } from '../lib/db';
import { TABLE_NAME as POST_TABLE_NAME, schema as postSchema, PostDetail, PostFullDetail } from '../models/Post';
import { TABLE_NAME as LOCAL_IMAGE_TABLE_NAME, schema as localImageSchema } from '../models/LocalImage';
import { TABLE_NAME as WORK_TABLE_NAME, schema as workSchema } from '../models/Work';
import { schema as userSchema, TABLE_NAME as USER_TABLE_NAME } from '../models/User';

export const fetchFullPostDetail = async (
  id: string,
): Promise<Knex.QueryBuilder<Record<string, unknown>, PostFullDetail>> => {
  return createFindFn(POST_TABLE_NAME, (table) => {
    table.leftJoin('user_image', 'user.id', '=', 'user_image.user_id');
    table.leftJoin({ avatar: 'local_image' }, 'user_image.local_image_id', '=', 'avatar.id');

    return table
      .select({
        ...postSchema(),
        ...userSchema('creator'),
        ...{ 'creator.avatar.file': 'avatar.stored_file' },
        ...localImageSchema(),
        ...workSchema(),
      })
      .first();
  })(id, [{ table: USER_TABLE_NAME, alias: 'creator' }, LOCAL_IMAGE_TABLE_NAME, WORK_TABLE_NAME]);
};

export const fetchIndexMosaic = async (): Promise<Knex.QueryBuilder<Record<string, unknown>, PostDetail[]>> => {
  return createFindAllFn(POST_TABLE_NAME, (table) => {
    return table.select({
      ...postSchema(),
      ...userSchema('creator'),
      ...localImageSchema(),
      ...workSchema(),
    });
  })([{ table: USER_TABLE_NAME, alias: 'creator' }, LOCAL_IMAGE_TABLE_NAME, WORK_TABLE_NAME], {
    'post.created_at': 'DESC',
  });
};
