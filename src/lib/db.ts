import Knex from 'knex';

import knexConfig from '../../knexfile';

// eslint-disable-next-line no-underscore-dangle
let _connection: Knex;

export type LeftJoinDefinition =
  | string
  | {
      table: string;
      alias: string;
    };

export const getDbConnection = (): Knex => {
  if (_connection == null) {
    _connection = Knex(knexConfig);
  }

  return _connection;
};

export const createFindFn = <T, R>(
  tableName: string,
  cb: (table: Knex.QueryBuilder<T, R>) => Knex.QueryBuilder<T, R>,
): ((id: string, leftJoinDefs?: LeftJoinDefinition[]) => Knex.QueryBuilder<T, R>) => {
  return (id: string, leftJoinDefs: LeftJoinDefinition[] | null = null): Knex.QueryBuilder<T, R> => {
    const connection = getDbConnection();
    const table = connection<T, R>(tableName);

    table.where(`${tableName}.id`, id);

    if (leftJoinDefs?.length) {
      leftJoinDefs.forEach((joinDefinition) => {
        if (typeof joinDefinition === 'string') {
          table.leftJoin(joinDefinition, `post.${joinDefinition}_id`, '=', `${joinDefinition}.id`);
        } else {
          table.leftJoin(joinDefinition.table, `post.${joinDefinition.alias}_id`, '=', `${joinDefinition.table}.id`);
        }
      });
    }

    return cb(table);
  };
};

export const createFindAllFn = <T, R>(
  tableName: string,
  cb: (table: Knex.QueryBuilder<T, R>) => Knex.QueryBuilder<T, R>,
): ((leftJoinDefs?: LeftJoinDefinition[], orderBy?: Record<string, string>) => Knex.QueryBuilder<T, R>) => {
  return (
    leftJoinDefs: LeftJoinDefinition[] | null = null,
    orderBy: Record<string, string> | null = null,
  ): Knex.QueryBuilder<T, R> => {
    const connection = getDbConnection();
    const table = connection<T, R>(tableName);

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

    return cb(table);
  };
};
