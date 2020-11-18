import Knex from 'knex';
import omit from 'lodash.omit';

import { getDbConnection } from '../lib/db';
import { TABLE_NAME as CYCLE_TABLE_NAME, schema as cycleSchema } from '../models/Cycle';
import { TABLE_NAME as POST_TABLE_NAME, schema as postSchema } from '../models/Post';
import { TABLE_NAME as LOCAL_IMAGE_TABLE_NAME, schema as localImageSchema } from '../models/LocalImage';
import { TABLE_NAME as WORK_TABLE_NAME, schema as workSchema } from '../models/Work';
import { TABLE_NAME as USER_TABLE_NAME, schema as userSchema } from '../models/User';
import { PostDetail, PostFullDetail } from '../types';

export const fetchFullPostDetail = async (
  id: string,
): Promise<Knex.QueryBuilder<Record<string, unknown>, PostFullDetail>> => {
  const connection = getDbConnection();
  const table = connection(POST_TABLE_NAME);

  table.leftJoin(USER_TABLE_NAME, 'post.creator_id', '=', `${USER_TABLE_NAME}.id`);
  table.leftJoin(LOCAL_IMAGE_TABLE_NAME, 'post.local_image_id', '=', `${LOCAL_IMAGE_TABLE_NAME}.id`);
  table.leftJoin(WORK_TABLE_NAME, 'post.work_id', '=', `${WORK_TABLE_NAME}.id`);
  table.leftJoin('user_image', 'user.id', '=', 'user_image.user_id');
  table.leftJoin({ avatar: 'local_image' }, 'user_image.local_image_id', '=', 'avatar.id');

  table.where(`${POST_TABLE_NAME}.id`, id);

  return table
    .select({
      ...omit(postSchema(), ['post.created_at', 'post.updated_at']),
      ...omit(userSchema('creator'), ['creator.created_at', 'creator.updated_at']),
      ...{ 'creator.avatar.file': 'avatar.stored_file' },
      ...omit(localImageSchema(), ['local_image.created_at', 'local_image.updated_at']),
      ...omit(workSchema(), ['work.created_at', 'work.updated_at']),
    })
    .first();
};

export const fetchIndexMosaic = async (): Promise<Knex.QueryBuilder<Record<string, unknown>, PostDetail[]>> => {
  const connection = getDbConnection();
  const table = connection(POST_TABLE_NAME);

  table.leftJoin(USER_TABLE_NAME, `post.creator_id`, '=', `${USER_TABLE_NAME}.id`);
  table.leftJoin(LOCAL_IMAGE_TABLE_NAME, 'post.local_image_id', '=', `${LOCAL_IMAGE_TABLE_NAME}.id`);
  table.leftJoin(WORK_TABLE_NAME, 'post.work_id', '=', `${WORK_TABLE_NAME}.id`);
  table.leftJoin('cycle_post', `${POST_TABLE_NAME}.id`, '=', 'cycle_post.post_id');
  table.leftJoin(CYCLE_TABLE_NAME, 'cycle_post.cycle_id', '=', `${CYCLE_TABLE_NAME}.id`);

  table.where('cycle_post.is_cover', true);
  table.orWhere('cycle_post.is_cover', null);
  table.orderBy('post.created_at', 'desc');

  return table.select({
    ...omit(postSchema(), ['post.created_at', 'post.updated_at']),
    ...omit(userSchema('creator'), ['creator.created_at', 'creator.updated_at']),
    ...omit(localImageSchema(), ['local_image.created_at', 'local_image.updated_at']),
    ...omit(workSchema(), ['work.created_at', 'work.updated_at']),
    ...omit(cycleSchema(), ['cycle.created_at', 'cycle.updated_at']),
  });
};
