import Knex from 'knex';
import { ParsedQs } from 'qs';

import { createFindAllFn } from '../lib/db';
import { TABLE_NAME as POST_TABLE_NAME, schema as postSchema, PostDetail, PostFullDetail } from '../models/Post';
import { TABLE_NAME as LOCAL_IMAGE_TABLE_NAME, schema as localImageSchema } from '../models/LocalImage';
import { TABLE_NAME as WORK_TABLE_NAME, schema as workSchema } from '../models/Work';

export const findAll = async (criteria?: ParsedQs): Promise<Knex.QueryBuilder> => {
  return createFindAllFn(WORK_TABLE_NAME, (table) => {
    table.leftJoin({ post: POST_TABLE_NAME }, 'work.id', '=', 'post.work_id');
    table.leftJoin({ local_image: LOCAL_IMAGE_TABLE_NAME }, 'post.local_image_id', '=', 'local_image.id');

    table.groupBy('work.id');
    table.orderBy('work.created_at', 'desc');
    table.orderBy('post.created_at', 'desc');

    if (criteria != null) {
      Object.entries(criteria).forEach((singleCriteria) => {
        table.where(singleCriteria[0], 'LIKE', `%${singleCriteria[1]}%`);
      });
    }

    return table.select({
      ...workSchema(),
      // ...postSchema(),
      ...localImageSchema(),
    });
  })();
};
