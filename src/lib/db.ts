import Knex from 'knex';

import knexConfig from '../../knexfile';

// eslint-disable-next-line no-underscore-dangle
let _connection: Knex;

export const getDbConnection = (): Knex => {
  if (_connection == null) {
    _connection = Knex(knexConfig);
  }

  return _connection;
};
