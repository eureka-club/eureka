import * as Knex from 'knex';
import * as uuid from 'uuid';

export async function seed(knex: Knex): Promise<void> {
  // delete ALL existing entries
  await knex('user').del();

  // insert seed entries
  await knex('user').insert([
    {
      id: uuid.v4(),
      user_name: 'srigi@brno',
      roles: ['guest', 'member', 'admin'],
      created_at: new Date(),
    },
  ]);
}
