import Knex from 'knex';

import knexConfig from '../../knexfile';

let _connection: Knex | null; // eslint-disable-line no-underscore-dangle

export const getDbConnection = async (): Promise<Knex> => {
  if (_connection == null) {
    _connection = Knex(knexConfig);

    await _connection.raw('PRAGMA journal_mode = WAL');
    await _connection.raw('PRAGMA foreign_keys = ON');
  }

  return _connection;
};
