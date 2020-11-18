import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user_image', (table) => {
    table.index('user_id');
    table.index('local_image_id');
  });

  return knex.schema.alterTable('post', (table) => {
    table.index('created_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user_image', (table) => {
    table.dropIndex('user_id');
    table.dropIndex('local_image_id');
  });

  return knex.schema.alterTable('post', (table) => {
    table.dropIndex('created_at');
  });
}
