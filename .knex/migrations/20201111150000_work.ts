import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('work', (table) => {
    table.uuid('id').notNullable().primary();
    table.string('type').notNullable();
    table.string('title').notNullable();
    table.string('author').notNullable();
    table.date('year_created').notNullable();
    table.string('link').notNullable();
    table.timestamps(true, true);

    table.index('title');
    table.index('author');
  });
}

export async function down(knex: Knex): Promise<void> {}
