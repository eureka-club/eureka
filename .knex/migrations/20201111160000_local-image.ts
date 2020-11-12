import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('local_image', (table) => {
    table.uuid('id').notNullable().primary();
    table.string('original_filename').notNullable();
    table.string('stored_file').notNullable();
    table.string('mime_type').notNullable();
    table.string('content_hash', 40).notNullable();
    table.timestamps(true, true);

    table.index('content_hash');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('local_image');
}
