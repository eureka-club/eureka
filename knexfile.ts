import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export default {
  client: 'sqlite3',
  connection:
    process.env.DATABASE_FILENAME != null ? { filename: process.env.DATABASE_FILENAME } : process.env.DATABASE_URL,
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
