import Knex from 'knex';
import { ParsedQs } from 'qs';

import { getDbConnection } from '../lib/db';
import { TABLE_NAME as POST_TABLE_NAME, schema as postSchema } from '../models/Post';
import { TABLE_NAME as LOCAL_IMAGE_TABLE_NAME, schema as localImageSchema } from '../models/LocalImage';
import { TABLE_NAME as WORK_TABLE_NAME, schema as workSchema } from '../models/Work';

export const findAll = async (criteria?: ParsedQs): Promise<Knex.QueryBuilder> => {
  const connection = getDbConnection();
  const table = connection(WORK_TABLE_NAME);

  table.joinRaw(`join [${POST_TABLE_NAME}] on [${POST_TABLE_NAME}].[id] = (
    select TOP 1 [${POST_TABLE_NAME}].[id]
    from [${POST_TABLE_NAME}]
    where [${POST_TABLE_NAME}].[work_id] = [work].[id]
    order by [${POST_TABLE_NAME}].[created_at])`);
  table.leftJoin({ local_image: LOCAL_IMAGE_TABLE_NAME }, 'post.local_image_id', '=', 'local_image.id');

  if (criteria != null) {
    Object.entries(criteria).forEach((singleCriteria) => {
      table.where(singleCriteria[0], 'LIKE', `%${singleCriteria[1]}%`);
    });
  }

  return table.select({
    ...workSchema(),
    ...postSchema(),
    ...localImageSchema(),
  });
};
