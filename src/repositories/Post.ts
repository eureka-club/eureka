import Knex from 'knex';

import { LeftJoinDefinition, createFindFn, createFindAllFn, hasLeftJoinDefinitionsTable } from '../lib/db';
import { TABLE_NAME as POST_TABLE_NAME, schema as postSchema } from '../models/Post';
import { TABLE_NAME as LOCAL_IMAGE_TABLE_NAME, schema as localImageSchema } from '../models/LocalImage';
import { TABLE_NAME as WORK_TABLE_NAME, schema as workSchema } from '../models/Work';
import { schema as userSchema, TABLE_NAME as USER_TABLE_NAME } from '../models/User';

export const fetchDetailPost = (id: string): Promise<Knex.QueryBuilder> => {
  const findFn = createFindFn(
    POST_TABLE_NAME,
    (table: Knex.QueryBuilder, leftJoinDefs: LeftJoinDefinition[] | null): Knex.QueryBuilder => {
      return table.select({
        ...postSchema(POST_TABLE_NAME),
        ...(hasLeftJoinDefinitionsTable(leftJoinDefs, 'creator') && userSchema('creator')),
        ...(hasLeftJoinDefinitionsTable(leftJoinDefs, LOCAL_IMAGE_TABLE_NAME) &&
          localImageSchema(LOCAL_IMAGE_TABLE_NAME)),
        ...(hasLeftJoinDefinitionsTable(leftJoinDefs, WORK_TABLE_NAME) && workSchema(WORK_TABLE_NAME)),
      });
    },
  );

  return findFn(id, [{ table: USER_TABLE_NAME, alias: 'creator' }, LOCAL_IMAGE_TABLE_NAME, WORK_TABLE_NAME]);
};

export const fetchIndexMosaic = (): Promise<Knex.QueryBuilder> => {
  const findFn = createFindAllFn(
    POST_TABLE_NAME,
    (table: Knex.QueryBuilder, leftJoinDefs: LeftJoinDefinition[] | null): Knex.QueryBuilder => {
      return table.select({
        ...postSchema(POST_TABLE_NAME),
        ...(hasLeftJoinDefinitionsTable(leftJoinDefs, 'creator') && userSchema('creator')),
        ...(hasLeftJoinDefinitionsTable(leftJoinDefs, LOCAL_IMAGE_TABLE_NAME) &&
          localImageSchema(LOCAL_IMAGE_TABLE_NAME)),
        ...(hasLeftJoinDefinitionsTable(leftJoinDefs, WORK_TABLE_NAME) && workSchema(WORK_TABLE_NAME)),
      });
    },
  );

  return findFn([{ table: USER_TABLE_NAME, alias: 'creator' }, LOCAL_IMAGE_TABLE_NAME, WORK_TABLE_NAME], {
    'post.created_at': 'DESC',
  });
};
