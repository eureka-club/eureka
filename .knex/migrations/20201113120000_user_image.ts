import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user_image', (table) => {
    table.uuid('user_id').notNullable();
    table.uuid('local_image_id').notNullable();
    table.timestamps(true, true);

    table.primary(['user_id', 'local_image_id']);
    table.foreign('user_id').references('user.id').onDelete('CASCADE').onUpdate('CASCADE');
    table.foreign('local_image_id').references('local_image.id').onDelete('CASCADE').onUpdate('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('user_image');
}
