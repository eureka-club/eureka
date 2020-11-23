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

  await knex.schema.createTable('local_image', (table) => {
    table.uuid('id').notNullable().primary();
    table.string('original_filename').notNullable();
    table.string('stored_file').notNullable();
    table.string('mime_type').notNullable();
    table.string('content_hash', 40).notNullable();
    table.timestamps(true, true);

    table.index('content_hash');
  });

  await knex.schema.createTable('post', (table) => {
    table.uuid('id').notNullable().primary();
    table.integer('creator_id').notNullable();
    table.uuid('local_image_id').notNullable();
    table.uuid('work_id').notNullable();
    table.string('language').notNullable();
    table.text('content_text').nullable();
    table.boolean('is_public').notNullable();
    table.timestamps(true, true);

    table.index('creator_id');
    table.foreign('creator_id').references('users.id').onDelete('CASCADE').onUpdate('CASCADE');
    table.index('local_image_id');
    table.foreign('local_image_id').references('local_image.id').onDelete('CASCADE').onUpdate('CASCADE');
    table.index('work_id');
    table.foreign('work_id').references('work.id').onDelete('CASCADE').onUpdate('CASCADE');
    table.index('created_at');
  });

  await knex.schema.createTable('cycle', (table) => {
    table.uuid('id').notNullable().primary();
    table.integer('creator_id').notNullable();
    table.string('title').notNullable();
    table.json('languages').notNullable();
    table.text('content_text').nullable();
    table.date('start_date').notNullable();
    table.date('end_date').notNullable();
    table.timestamps(true, true);

    table.index('creator_id');
    table.foreign('creator_id').references('users.id').onDelete('CASCADE').onUpdate('CASCADE');
  });

  return knex.schema.createTable('cycle_post', (table) => {
    table.uuid('cycle_id').notNullable();
    table.uuid('post_id').notNullable();
    table.boolean('is_cover').notNullable();
    table.timestamps(true, true);

    table.primary(['cycle_id', 'post_id']);
    table.index('cycle_id');
    table.foreign('cycle_id').references('cycle.id').onDelete('CASCADE').onUpdate('CASCADE');
    table.index('post_id');
    table.foreign('post_id').references('post.id'); // .onDelete('CASCADE').onUpdate('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('cycle_post');
  await knex.schema.dropTable('cycle');
  await knex.schema.dropTable('post');
  await knex.schema.dropTable('local_image');
  return knex.schema.dropTable('work');
}
