import * as Knex from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('cycle_post').del();
  await knex('cycle').del();

  // Inserts seed entries
  await knex('cycle').insert([
    {
      id: 'b6a3c0fc-b481-43f1-bae0-11e9a2f44a0a',
      creator_id: '340c3ef1-d00b-4480-b9a3-60ce197fdff8',
      title: 'Pulp Fiction material gathering',
      languages: JSON.stringify(['english']),
      content_text: 'Lets gather all info about movie',
      start_date: '2020-06-01',
      end_date: '2020-12-31',
    },
    {
      id: 'c37550c9-63fb-48ba-a8ef-f31b7bbffffa',
      creator_id: '2878d482-9922-426d-889e-ab1a816df96a',
      title: 'Sci-fi marathon',
      languages: JSON.stringify(['english']),
      content_text: "Let's watch some sci-fi movies",
      start_date: '2020-06-01',
      end_date: '2020-12-31',
    },
  ]);

  await knex('cycle_post').insert([
    {
      cycle_id: 'b6a3c0fc-b481-43f1-bae0-11e9a2f44a0a',
      post_id: '184AA581-9345-4912-87C2-46870E6A557D',
      is_cover: true,
    },
    {
      cycle_id: 'c37550c9-63fb-48ba-a8ef-f31b7bbffffa',
      post_id: '3772b05c-fe51-45f1-a7f1-b03542f921ee',
      is_cover: false,
    },
    {
      cycle_id: 'c37550c9-63fb-48ba-a8ef-f31b7bbffffa',
      post_id: 'ae4efae2-de77-499d-81f5-04c7df1ab7c3',
      is_cover: true,
    },
    {
      cycle_id: 'c37550c9-63fb-48ba-a8ef-f31b7bbffffa',
      post_id: '015a2f84-137c-4a6f-89f3-27fa674647fd',
      is_cover: true,
    },
  ]);
}
