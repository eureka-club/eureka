import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user', (table) => {
    table.increments('id').notNullable().primary();
    table.string('user_name', 255).notNullable();
    table.json('roles').notNullable();
    table.timestamps(true, true);

    table.unique(['user_name']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('user');
}
