import Knex from 'knex';

import knexConfig, { CLIENT_SQLITE3 } from '../../knexfile';

// eslint-disable-next-line no-underscore-dangle
let _connection: Knex;

export type LeftJoinDefinition =
  | string
  | {
      table: string;
      alias: string;
    };

export const getDbConnection = async (): Promise<Knex> => {
  if (_connection == null) {
    _connection = Knex(knexConfig);

    if (knexConfig.client === CLIENT_SQLITE3) {
      await _connection.raw('PRAGMA journal_mode = WAL');
      await _connection.raw('PRAGMA foreign_keys = ON');
    }
  }

  return _connection;
};

export const hasLeftJoinDefinitionsTable = (leftJoinDefs: LeftJoinDefinition[] | null, alias: string): boolean => {
  if (leftJoinDefs == null) {
    return false;
  }

  return leftJoinDefs.some((leftJoinDefinition) => {
    return typeof leftJoinDefinition === 'string' ? leftJoinDefinition === alias : leftJoinDefinition.alias === alias;
  });
};

export const createFindFn = (
  tableName: string,
  cb: (table: Knex.QueryBuilder, leftJoinDefs: LeftJoinDefinition[] | null) => Knex.QueryBuilder,
) => {
  return async (id: string, leftJoinDefs: LeftJoinDefinition[] | null = null): Promise<Knex.QueryBuilder> => {
    const connection = await getDbConnection();
    const table = connection(tableName);

    table.where(`${tableName}.id`, id).first();

    if (leftJoinDefs?.length) {
      leftJoinDefs.forEach((joinDefinition) => {
        if (typeof joinDefinition === 'string') {
          table.leftJoin(joinDefinition, `post.${joinDefinition}_id`, '=', `${joinDefinition}.id`);
        } else {
          table.leftJoin(joinDefinition.table, `post.${joinDefinition.alias}_id`, '=', `${joinDefinition.table}.id`);
        }
      });
    }

    return cb(table, leftJoinDefs);
  };
};

export const createFindAllFn = (
  tableName: string,
  cb: (table: Knex.QueryBuilder, leftJoinDefs: LeftJoinDefinition[] | null) => Knex.QueryBuilder,
) => {
  return async (
    leftJoinDefs: LeftJoinDefinition[] | null = null,
    orderBy: Record<string, string> | null = null,
  ): Promise<Knex.QueryBuilder> => {
    const connection = await getDbConnection();
    const table = connection(tableName);

    if (orderBy != null) {
      Object.entries(orderBy).forEach((entry) => {
        table.orderBy([{ column: entry[0], order: entry[1] }]);
      });
    }

    if (leftJoinDefs?.length) {
      leftJoinDefs.forEach((joinDefinition) => {
        if (typeof joinDefinition === 'string') {
          table.leftJoin(joinDefinition, `post.${joinDefinition}_id`, '=', `${joinDefinition}.id`);
        } else {
          table.leftJoin(joinDefinition.table, `post.${joinDefinition.alias}_id`, '=', `${joinDefinition.table}.id`);
        }
      });
    }

    return cb(table, leftJoinDefs);
  };
};
