import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('work', (table) => {
    table.uuid('id').notNullable().primary();
    table.string('title').notNullable();
    table.string('author').notNullable();
    table.string('type').notNullable();
    table.string('link').nullable();
    table.timestamps(true, true);

    table.index('title');
    table.unique(['title', 'author', 'type']);
  });

  await knex.schema.createTable('user', (table) => {
    table.uuid('id').notNullable().primary();
    table.string('user_name').notNullable();
    table.json('roles').notNullable();
    table.timestamps(true, true);

    table.unique(['user_name']);
  });

  await knex.schema.createTable('local_image', (table) => {
    table.uuid('id').notNullable().primary();
    table.string('original_filename').notNullable();
    table.string('stored_file').notNullable();
    table.string('mime_type').notNullable();
    table.string('content_hash', 40).notNullable();
    table.timestamps(true, true);

    table.index('content_hash');
  });

  await knex.schema.createTable('user_image', (table) => {
    table.uuid('user_id').notNullable();
    table.uuid('local_image_id').notNullable();
    table.timestamps(true, true);

    table.primary(['user_id', 'local_image_id']);
    table.foreign('user_id').references('user.id').onDelete('CASCADE').onUpdate('CASCADE');
    table.foreign('local_image_id').references('local_image.id').onDelete('CASCADE').onUpdate('CASCADE');
  });

  return knex.schema.createTable('post', (table) => {
    table.uuid('id').notNullable().primary();
    table.uuid('creator_id').notNullable();
    table.uuid('local_image_id').notNullable();
    table.uuid('work_id').notNullable();
    table.string('language').notNullable();
    table.text('content_text').nullable();
    table.boolean('is_public').notNullable();
    table.timestamps(true, true);

    table.index('creator_id');
    table.foreign('creator_id').references('user.id').onDelete('CASCADE').onUpdate('CASCADE');
    table.index('local_image_id');
    table.foreign('local_image_id').references('local_image.id').onDelete('CASCADE').onUpdate('CASCADE');
    table.index('work_id');
    table.foreign('work_id').references('work.id').onDelete('CASCADE').onUpdate('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('post');
  await knex.schema.dropTable('user_image');
  await knex.schema.dropTable('local_image');
  await knex.schema.dropTable('user');
  return knex.schema.dropTable('work');
}
