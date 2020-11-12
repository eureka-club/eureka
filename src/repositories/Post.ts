import Knex from 'knex';

import { LeftJoinDefinition, createFindFn, createFindAllFn, hasLeftJoinDefinitionsTable } from '../lib/db';
import { TABLE_NAME as POST_TABLE_NAME, schema as postSchema } from '../models/Post';
import { TABLE_NAME as LOCAL_IMAGE_TABLE_NAME, schema as localImageSchema } from '../models/LocalImage';
import { TABLE_NAME as WORK_TABLE_NAME, schema as workSchema } from '../models/Work';
import { schema as userSchema } from '../models/User';

export const find = createFindFn(
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

export const findAll = createFindAllFn(
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
