import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user', (table) => {
    table.uuid('id').notNullable().primary();
    table.string('user_name', 255).notNullable();
    table.json('roles').notNullable();
    table.timestamp('created_at', { precision: 3, useTz: false }).notNullable();
    table.timestamp('updated_at', { precision: 3, useTz: false }).nullable();

    table.unique(['user_name']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('user');
}
