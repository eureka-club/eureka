import Knex from 'knex';
import omit from 'lodash.omit';

import { getDbConnection } from '../lib/db';
import { TABLE_NAME as CYCLE_TABLE_NAME, schema as cycleSchema } from '../models/Cycle';
import { TABLE_NAME as LOCAL_IMAGE_TABLE_NAME } from '../models/LocalImage';
import { TABLE_NAME as USER_TABLE_NAME, schema as userSchema } from '../models/User';
import { PostFullDetail } from '../types';

export const fetchCycleDetail = async (
  id: string,
): Promise<Knex.QueryBuilder<Record<string, unknown>, PostFullDetail>> => {
  const connection = getDbConnection();
  const table = connection(CYCLE_TABLE_NAME);

  table.leftJoin(USER_TABLE_NAME, `${CYCLE_TABLE_NAME}.creator_id`, '=', `${USER_TABLE_NAME}.id`);
  table.leftJoin('user_image', `${USER_TABLE_NAME}.id`, '=', 'user_image.user_id');
  table.leftJoin({ avatar: LOCAL_IMAGE_TABLE_NAME }, 'user_image.local_image_id', '=', 'avatar.id');
  table.where(`${CYCLE_TABLE_NAME}.id`, id);

  return table
    .select({
      ...omit(cycleSchema(), ['cycle.created_at', 'cycle.updated_at']),
      ...omit(userSchema('creator'), ['creator.created_at', 'creator.updated_at']),
      ...{ 'creator.avatar.file': 'avatar.stored_file' },
    })
    .first();
};
