import Knex from 'knex';
import omit from 'lodash/omit';

import { getDbConnection } from '../lib/db';
import { TABLE_NAME as POST_TABLE_NAME, schema as postSchema } from '../models/Post';
import { TABLE_NAME as LOCAL_IMAGE_TABLE_NAME, schema as localImageSchema } from '../models/LocalImage';
import { TABLE_NAME as USER_TABLE_NAME, schema as userSchema } from '../models/User';
import { TABLE_NAME as WORK_TABLE_NAME, schema as workSchema } from '../models/Work';

export const findAll = async (
  criteria?: Record<string, unknown>,
  returnAllPosts = false,
  limit = 25,
): Promise<Knex.QueryBuilder> => {
  const connection = getDbConnection();
  const table = connection(WORK_TABLE_NAME);

  if (returnAllPosts) {
    table.leftJoin(POST_TABLE_NAME, `${WORK_TABLE_NAME}.id`, '=', `${POST_TABLE_NAME}.work_id`);
  } else {
    // select Work & fist related Post
    // https://stackoverflow.com/questions/2043259/how-to-join-to-first-row/2043290#2043290
    table.joinRaw(`join [${POST_TABLE_NAME}] on [${POST_TABLE_NAME}].[id] = (
    select TOP 1 [${POST_TABLE_NAME}].[id]
    from [${POST_TABLE_NAME}]
    where [${POST_TABLE_NAME}].[work_id] = [work].[id]
    order by [${POST_TABLE_NAME}].[created_at])`);
  }

  table.leftJoin(USER_TABLE_NAME, 'post.creator_id', '=', `${USER_TABLE_NAME}.id`);
  table.leftJoin({ local_image: LOCAL_IMAGE_TABLE_NAME }, 'post.local_image_id', '=', 'local_image.id');

  if (criteria != null) {
    Object.entries(criteria).forEach((singleCriteria) => {
      table.where(singleCriteria[0], 'LIKE', `%${singleCriteria[1]}%`);
    });
  }

  return table
    .select({
      ...omit(workSchema(), ['work.updated_at']),
      ...omit(postSchema(), ['post.updated_at']),
      ...omit(userSchema('creator'), ['creator.roles', 'creator.created_at', 'creator.updated_at']),
      ...omit(localImageSchema(), ['local_image.created_at', 'local_image.updated_at']),
    })
    .limit(limit);
};
