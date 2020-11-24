import Knex from 'knex';
import omit from 'lodash/omit';

import { getDbConnection } from '../lib/db';
import { TABLE_NAME as CYCLE_TABLE_NAME, schema as cycleSchema } from '../models/Cycle';
import {
  TABLE_NAME as LOCAL_IMAGE_TABLE_NAME,
  LocalImageDbObject,
  schema as localImageSchema,
} from '../models/LocalImage';
import { TABLE_NAME as POST_TABLE_NAME } from '../models/Post';
import { TABLE_NAME as USER_TABLE_NAME, schema as userSchema } from '../models/User';
import { TABLE_NAME as WORK_TABLE_NAME, WorkDbObject, schema as workSchema } from '../models/Work';
import { PostDetail } from '../types';

export const fetchCycleDetail = async (id: string): Promise<Knex.QueryBuilder<Record<string, unknown>, PostDetail>> => {
  const connection = getDbConnection();
  const table = connection(CYCLE_TABLE_NAME);

  table.leftJoin(USER_TABLE_NAME, `${CYCLE_TABLE_NAME}.creator_id`, '=', `${USER_TABLE_NAME}.id`);
  table.where(`${CYCLE_TABLE_NAME}.id`, id);

  return table
    .select({
      ...omit(cycleSchema(), ['cycle.created_at', 'cycle.updated_at']),
      ...omit(userSchema('creator'), ['creator.id', 'creator.email', 'creator.created_at', 'creator.updated_at']),
    })
    .first();
};

export const fetchCycleWorks = async (
  id: string,
  limit = 255,
): Promise<Knex.QueryBuilder<Record<string, unknown>, (WorkDbObject & LocalImageDbObject)[]>> => {
  const connection = getDbConnection();

  const cycleTable = connection(CYCLE_TABLE_NAME);
  cycleTable.leftJoin('cycle_post', `${CYCLE_TABLE_NAME}.id`, '=', 'cycle_post.cycle_id');
  cycleTable.leftJoin(POST_TABLE_NAME, 'cycle_post.post_id', '=', `${POST_TABLE_NAME}.id`);
  const allWorkInCycle = (await cycleTable.select('work_id').distinct().where(`${CYCLE_TABLE_NAME}.id`, id)).map(
    (postRecord) => postRecord.work_id,
  );

  const workTable = connection(WORK_TABLE_NAME);
  workTable.joinRaw(`join [${POST_TABLE_NAME}] on [${POST_TABLE_NAME}].[id] = (
    select TOP 1 [${POST_TABLE_NAME}].[id]
    from [${POST_TABLE_NAME}]
    where [${POST_TABLE_NAME}].[work_id] = [work].[id]
    order by [${POST_TABLE_NAME}].[created_at])`);
  workTable.leftJoin({ local_image: LOCAL_IMAGE_TABLE_NAME }, 'post.local_image_id', '=', 'local_image.id');
  workTable.whereIn('work.id', allWorkInCycle);

  return workTable
    .select({
      ...omit(workSchema(), ['work.created_at', 'work.updated_at']),
      ...omit(localImageSchema(), ['local_image.created_at', 'local_image.updated_at']),
    })
    .limit(limit);
};
