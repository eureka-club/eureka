import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('post', (table) => {
    table.string('language').notNullable().defaultTo('english');
    table.boolean('is_public').notNullable().defaultTo(true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('post', (table) => {
    table.dropColumn('language');
    table.dropColumn('is_public');
  });
}
