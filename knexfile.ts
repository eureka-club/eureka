import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export const CLIENT_SQLITE3 = 'sqlite3';

export default {
  client: process.env.DATABASE_ENGINE,
  connection:
    process.env.DATABASE_ENGINE === CLIENT_SQLITE3
      ? { filename: process.env.DATABASE_FILE || '.data/main.sqlite3' }
      : process.env.DATABASE_URL,
  debug: process.env.NODE_ENV !== 'production',
  ...(process.env.NODE_ENV === 'production' && {
    pool: {
      min: 2,
      max: 10,
    },
  }),
  useNullAsDefault: true,
  migrations: {
    directory: '.knex/migrations',
  },
  seeds: {
    directory: '.knex/seeds',
  },
};
