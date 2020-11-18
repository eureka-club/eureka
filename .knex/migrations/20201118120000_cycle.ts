import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('cycle', (table) => {
    table.uuid('id').notNullable().primary();
    table.uuid('creator_id').notNullable();
    table.string('title').notNullable();
    table.json('languages').notNullable();
    table.text('content_text').nullable();
    table.date('start_date').notNullable();
    table.date('end_date').notNullable();
    table.timestamps(true, true);

    table.index('creator_id');
    table.foreign('creator_id').references('user.id').onDelete('CASCADE').onUpdate('CASCADE');
  });

  return knex.schema.createTable('cycle_post', (table) => {
    table.uuid('cycle_id').notNullable();
    table.uuid('post_id').notNullable();
    table.boolean('is_cover').notNullable();
    table.timestamps(true, true);

    table.primary(['cycle_id', 'post_id']);
    table.index('cycle_id');
    table.foreign('cycle_id').references('cycle.id'); //.onDelete('CASCADE').onUpdate('CASCADE');
    table.index('post_id');
    table.foreign('post_id').references('post.id'); //.onDelete('CASCADE').onUpdate('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('cycle_post');
  return knex.schema.dropTable('cycle');
}
