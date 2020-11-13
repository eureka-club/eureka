import * as Knex from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('work').del();

  // Inserts seed entries
  await knex('work').insert([
    {
      id: 'b7365c11-6ede-43b8-a202-b11f65b91b3e',
      type: 'movie',
      title: 'Pulp Fiction',
      author: 'Quentin Tarantino',
      year_created: '1994',
      link: 'https://www.imdb.com/title/tt0110912/',
    },
    {
      id: '13bbaa4e-28f7-438e-b39f-2fa77a8893ce',
      type: 'movie',
      title: 'American Beauty',
      author: 'Sam Mendes',
      year_created: '1999',
      link: 'https://www.imdb.com/title/tt0169547/',
    },
    {
      id: '39a57597-6be9-4228-ae30-a588711ea64e',
      type: 'movie',
      title: 'Iron Man',
      author: 'Jon Favreau',
      year_created: '2008',
      link: 'https://www.imdb.com/title/tt0371746/',
    },
    {
      id: '73bfee7a-e313-4e6f-918b-753ba0e5c9cd',
      type: 'digital art',
      title: 'VR Dreams',
      author: 'Thorsten-Denk',
      year_created: '2018',
      link: 'https://www.deviantart.com/thorsten-denk/art/VR-Dreams-772010046',
    },
    {
      id: 'aaa7da10-c7f0-44e1-b091-034438ce6ecb',
      type: 'digital art',
      title: 'Traveling with your octopus',
      author: 'BrianKesinger',
      year_created: '2014',
      link: 'https://www.deviantart.com/briankesinger/art/Traveling-with-your-octopus-476470538',
    },
    {
      id: 'faa0a56a-b92a-4e88-a433-a5751204da14',
      type: 'digital art',
      title: 'Emeraude',
      author: 'AlexandraVBach',
      year_created: '2019',
      link: 'https://www.deviantart.com/alexandravbach/art/Emeraude-796070439',
    },
    {
      id: 'ff2a05a8-4d61-4cb0-9e07-373d13dfa86c',
      type: 'digital art',
      title: 'The Mandalorian',
      author: 'PatrickBrown',
      year_created: '2020',
      link: 'https://www.deviantart.com/patrickbrown/art/The-Mandalorian-849330562',
    },
  ]);
}
