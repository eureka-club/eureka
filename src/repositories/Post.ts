import Knex from 'knex';
import omit from 'lodash/omit';

import { getDbConnection } from '../lib/db';
import { TABLE_NAME as CYCLE_TABLE_NAME, schema as cycleSchema } from '../models/Cycle';
import { TABLE_NAME as POST_TABLE_NAME, schema as postSchema } from '../models/Post';
import { TABLE_NAME as LOCAL_IMAGE_TABLE_NAME, schema as localImageSchema } from '../models/LocalImage';
import { TABLE_NAME as WORK_TABLE_NAME, schema as workSchema } from '../models/Work';
import { TABLE_NAME as USER_TABLE_NAME, schema as userSchema } from '../models/User';
import { PostDetail } from '../types';

export const fetchFullPostDetail = async (
  id: string,
): Promise<Knex.QueryBuilder<Record<string, unknown>, PostDetail>> => {
  const connection = getDbConnection();
  const table = connection(POST_TABLE_NAME);

  table.leftJoin(USER_TABLE_NAME, 'post.creator_id', '=', `${USER_TABLE_NAME}.id`);
  table.leftJoin(LOCAL_IMAGE_TABLE_NAME, 'post.local_image_id', '=', `${LOCAL_IMAGE_TABLE_NAME}.id`);
  table.leftJoin(WORK_TABLE_NAME, 'post.work_id', '=', `${WORK_TABLE_NAME}.id`);

  table.where(`${POST_TABLE_NAME}.id`, id);

  return table
    .select({
      ...omit(postSchema(), ['post.created_at', 'post.updated_at']),
      ...omit(userSchema('creator'), ['creator.created_at', 'creator.updated_at']),
      ...omit(localImageSchema(), ['local_image.created_at', 'local_image.updated_at']),
      ...omit(workSchema(), ['work.created_at', 'work.updated_at']),
    })
    .first();
};

export const fetchIndexMosaic = async (
  limit = 25,
): Promise<Knex.QueryBuilder<Record<string, unknown>, PostDetail[]>> => {
  const connection = getDbConnection();
  const table = connection(POST_TABLE_NAME);

  table.leftJoin(USER_TABLE_NAME, `post.creator_id`, '=', `${USER_TABLE_NAME}.id`);
  table.leftJoin(LOCAL_IMAGE_TABLE_NAME, 'post.local_image_id', '=', `${LOCAL_IMAGE_TABLE_NAME}.id`);
  table.leftJoin(WORK_TABLE_NAME, 'post.work_id', '=', `${WORK_TABLE_NAME}.id`);
  table.leftJoin('cycle_post', `${POST_TABLE_NAME}.id`, '=', 'cycle_post.post_id');
  table.leftJoin(CYCLE_TABLE_NAME, 'cycle_post.cycle_id', '=', `${CYCLE_TABLE_NAME}.id`);

  table.orderBy('post.created_at', 'desc');

  return table
    .select({
      ...omit(postSchema(), ['post.created_at', 'post.updated_at']),
      ...omit(userSchema('creator'), ['creator.created_at', 'creator.updated_at']),
      ...omit(localImageSchema(), ['local_image.created_at', 'local_image.updated_at']),
      ...omit(workSchema(), ['work.created_at', 'work.updated_at']),
      ...omit(cycleSchema(), ['cycle.created_at', 'cycle.updated_at']),
    })
    .limit(limit);
};

export const findRelatedPosts = async (
  post: PostDetail,
  limit = 25,
): Promise<Knex.QueryBuilder<Record<string, unknown>, PostDetail[]>> => {
  const connection = getDbConnection();
  const table = connection(POST_TABLE_NAME);

  table.leftJoin(LOCAL_IMAGE_TABLE_NAME, 'post.local_image_id', '=', `${LOCAL_IMAGE_TABLE_NAME}.id`);
  table.leftJoin(WORK_TABLE_NAME, 'post.work_id', '=', `${WORK_TABLE_NAME}.id`);

  table.where('post.work_id', post['work.id']).andWhere('post.id', '!=', post['post.id']);

  return table
    .select({
      ...omit(postSchema(), ['post.created_at', 'post.updated_at']),
      ...omit(localImageSchema(), ['local_image.created_at', 'local_image.updated_at']),
      ...omit(workSchema(), ['work.created_at', 'work.updated_at']),
    })
    .limit(limit);
};
