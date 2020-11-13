import * as Knex from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('user_image').del();

  // Inserts seed entries
  await knex('user_image').insert([
    { user_id: '340c3ef1-d00b-4480-b9a3-60ce197fdff8', local_image_id: '88b74a91-1a2e-4ae6-8cde-9b73c5447637' },
    { user_id: '2878d482-9922-426d-889e-ab1a816df96a', local_image_id: 'd67627e9-8ba2-4f39-885b-11a600fd5777' },
  ]);
}
