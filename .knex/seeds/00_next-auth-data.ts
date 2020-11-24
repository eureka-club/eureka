import * as Knex from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('users').del();
  await knex('accounts').del();
  await knex('sessions').del();
  await knex('verification_requests').del();

  // Inserts seed entries
  await knex('users').insert([
    {
      name: 'Igor Hlina',
      email: 'igor.hlina@toptal.com',
      image: 'https://lh3.googleusercontent.com/a-/AOh14GhPZsIhDZ-Y8MBfODvCvrxzRQp_z8UeoVaGANpg=s96-c',
    },
    {
      name: 'Srigi',
      email: 'srigisk@gmail.com',
      image: 'https://lh3.googleusercontent.com/a-/AOh14GhHAGHWmxF6TP0ljkfmrK8ySpIf3Gzy01A7Hnq-zw=s96-c',
    },
  ]);

  await knex('accounts').insert([
    {
      user_id: 1,
      compound_id: 'cb710e0aee6f5f16b85af4dc5981b358f0c9bf0470dbbc1d57a0258220ba827b',
      provider_id: 'google',
      provider_type: 'oauth',
      provider_account_id: '115394019992595173907',
      access_token:
        '0000.0000000000000000000000000000000000-000000-00000000000000000000_000000000000000000000-0000000000000000000000000000000-0000000000000000000000000000000000_000000000000000000000',
    },
    {
      user_id: 2,
      compound_id: '8d9c037efd52c44b61863d400be6937ac265045f2088af850b3eb5dd9307a3c7',
      provider_id: 'google',
      provider_type: 'oauth',
      provider_account_id: '117140206226892259159',
      access_token:
        '0000.0000000000000000000000000000000000-000000-00000000000000000000_000000000000000000000-0000000000000000000000000000000-0000000000000000000000000000000000_000000000000000000000',
    },
  ]);
}
