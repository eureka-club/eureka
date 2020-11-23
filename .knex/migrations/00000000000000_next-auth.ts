import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').notNullable().primary(); // Next-auth requires INT PKs
    table.string('name').nullable();
    table.string('email').nullable();
    table.dateTime('email_verified').nullable();
    table.string('image').nullable();
    table.timestamps();

    table.index('email');
  });

  await knex.schema.createTable('accounts', (table) => {
    table.increments('id').notNullable().primary();
    table.integer('user_id').notNullable();
    table.string('compound_id').notNullable();
    table.string('provider_id').notNullable();
    table.string('provider_type').notNullable();
    table.string('provider_account_id').notNullable();
    table.text('refresh_token').nullable();
    table.text('access_token').nullable();
    table.dateTime('access_token_expires').nullable();
    table.timestamps();

    table.index('user_id');
    table.foreign('user_id').references('users.id').onDelete('CASCADE').onUpdate('CASCADE');
    table.index('compound_id');
  });

  await knex.schema.createTable('sessions', (table) => {
    table.increments('id').notNullable().primary();
    table.integer('user_id').notNullable();
    table.dateTime('expires').notNullable();
    table.string('session_token').notNullable();
    table.string('access_token').notNullable();
    table.timestamps();

    table.index('user_id');
    table.foreign('user_id').references('users.id').onDelete('CASCADE').onUpdate('CASCADE');
  });

  return knex.schema.createTable('verification_requests', (table) => {
    table.increments('id').notNullable().primary();
    table.string('identifier').notNullable();
    table.string('token').notNullable();
    table.dateTime('expires').notNullable();
    table.timestamps();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('verification_requests');
  await knex.schema.dropTable('sessions');
  await knex.schema.dropTable('accounts');
  return knex.schema.dropTable('users');
}
