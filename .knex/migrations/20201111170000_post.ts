import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('post', (table) => {
    table.uuid('id').notNullable().primary();
    table.uuid('creator_id').notNullable();
    table.uuid('local_image_id').notNullable();
    table.uuid('work_id').notNullable();
    table.text('content_text').notNullable();
    table.timestamps(true, true);

    table.index('creator_id');
    table.foreign('creator_id').references('user.id').onDelete('CASCADE').onUpdate('CASCADE');
    table.index('local_image_id');
    table.foreign('local_image_id').references('local_image.id').onDelete('CASCADE').onUpdate('CASCADE');
    table.index('work_id');
    table.foreign('work_id').references('work.id').onDelete('CASCADE').onUpdate('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {}
