import * as Knex from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // delete ALL existing entries
  await knex('user').del();

  // insert seed entries
  await knex('user').insert([
    {
      id: '340c3ef1-d00b-4480-b9a3-60ce197fdff8',
      user_name: 'srigi@brno',
      roles: JSON.stringify(['member', 'admin']),
    },
    {
      id: '2878d482-9922-426d-889e-ab1a816df96a',
      user_name: 'deployer@connor',
      roles: JSON.stringify(['member', 'admin']),
    },
  ]);
}
