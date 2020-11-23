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
        'ya29.a0AfH6SMDHXGpcZKVbLRcPh4b6nHjP7c1s-VBZu_j-2SvX1EmPMLSFhhw2eSz2_COHs0Tsvbi2Ey3iGuaenB-Gu2JO0nzEp3tAGu8gdqXIna7aXzJgy9-PaSO8aRsRD1PGKnLuveb6xeFdXwpqYpbhw_ZSsNsKofeeXaoLCCby0KM',
    },
    {
      user_id: 2,
      compound_id: '8d9c037efd52c44b61863d400be6937ac265045f2088af850b3eb5dd9307a3c7',
      provider_id: 'google',
      provider_type: 'oauth',
      provider_account_id: '117140206226892259159',
      access_token:
        'ya29.a0AfH6SMDpRfrxDnoobFFXGAiMXzRUg6V1LT4nQMzBz4-jpK9h3vI3tFPudVgePY7xkY_wltkAqf7gJoAiUH--_oFunZ5YRVtDnbUUfk4MdefrWEndmI65VNnFTT6xVND93hDpGfhOy4xHULFe7o3vB2qVhB_wMwiCPyJHR0sxRnA',
    },
  ]);
}
