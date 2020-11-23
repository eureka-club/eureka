import * as Knex from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('cycle_post').del();
  await knex('cycle').del();
  await knex('post').del();
  await knex('local_image').del();
  await knex('work').del();

  // Inserts seed entries
  await knex('work').insert([
    {
      id: 'b7365c11-6ede-43b8-a202-b11f65b91b3e',
      type: 'movie',
      title: 'Pulp Fiction',
      author: 'Quentin Tarantino',
      link: 'https://www.imdb.com/title/tt0110912/',
    },
    {
      id: '13bbaa4e-28f7-438e-b39f-2fa77a8893ce',
      type: 'movie',
      title: 'American Beauty',
      author: 'Sam Mendes',
      link: 'https://www.imdb.com/title/tt0169547/',
    },
    {
      id: '39a57597-6be9-4228-ae30-a588711ea64e',
      type: 'movie',
      title: 'Iron Man',
      author: 'Jon Favreau',
      link: 'https://www.imdb.com/title/tt0371746/',
    },
    {
      id: '73bfee7a-e313-4e6f-918b-753ba0e5c9cd',
      type: 'digital art',
      title: 'VR Dreams',
      author: 'Thorsten-Denk',
      link: 'https://www.deviantart.com/thorsten-denk/art/VR-Dreams-772010046',
    },
    {
      id: 'aaa7da10-c7f0-44e1-b091-034438ce6ecb',
      type: 'digital art',
      title: 'Traveling with your octopus',
      author: 'BrianKesinger',
    },
    {
      id: 'faa0a56a-b92a-4e88-a433-a5751204da14',
      type: 'digital art',
      title: 'Emeraude',
      author: 'AlexandraVBach',
    },
    {
      id: 'ff2a05a8-4d61-4cb0-9e07-373d13dfa86c',
      type: 'digital art',
      title: 'The Mandalorian',
      author: 'PatrickBrown',
      link: 'https://www.deviantart.com/patrickbrown/art/The-Mandalorian-849330562',
    },
  ]);

  await knex('local_image').insert([
    {
      id: '076f972b-79ce-4d68-b891-cce9b7c3fd43',
      original_filename: 'pulp-fiction-cover.jpg',
      stored_file: '17/17ee3047b081ec51be6692ecbe381463d3d7887b.jpg',
      mime_type: 'image/jpeg',
      content_hash: '17ee3047b081ec51be6692ecbe381463d3d7887b',
    },
    {
      id: '42cd3b68-58e3-4238-b0be-d3a1b9c17a4f',
      original_filename: 'VR dreams.jpg',
      stored_file: '9d/9dbcd094d58600adc2256cc525fc44326fbc639b.jpg',
      mime_type: 'image/jpeg',
      content_hash: '9dbcd094d58600adc2256cc525fc44326fbc639b',
    },
    {
      id: 'e4f447f5-644d-4516-8d72-7b6528c1dcbd',
      original_filename: 'ironman-cover.jpg',
      stored_file: '36/369f1314cc1f42b4e66f552b134eedae6e29a5a5.jpg',
      mime_type: 'image/jpeg',
      content_hash: '369f1314cc1f42b4e66f552b134eedae6e29a5a5',
    },
    {
      id: '58ecae62-d06f-4a66-8321-2bdd49f3efb2',
      original_filename: 'american beauty (cover).jpg',
      stored_file: 'f0/f03942031e7e914d32e67d26091e64b5e300f113.jpg',
      mime_type: 'image/jpeg',
      content_hash: 'f03942031e7e914d32e67d26091e64b5e300f113',
    },
    {
      id: '40c41c51-59b0-44ae-8459-346946e0d026',
      original_filename: 'traveling-with-your-octopus.jpg',
      stored_file: '80/803f3108aa70a655cf54caefce3c449328f59b0e.jpg',
      mime_type: 'image/jpeg',
      content_hash: '803f3108aa70a655cf54caefce3c449328f59b0e',
    },
    {
      id: 'afa8cef7-645b-4376-a23a-00b670fdd902',
      original_filename: 'dd5yjvr.jpg',
      stored_file: '7a/7afbfce2c865fc0361183951d9d7bbcf64dc813f.jpg',
      mime_type: 'image/jpeg',
      content_hash: '7afbfce2c865fc0361183951d9d7bbcf64dc813f',
    },
    {
      id: 'f53dbaaf-ecf4-421f-90f8-55b7a5d97b68',
      original_filename: 'the_mandalorian_by_patrickbrown_de1o3nm-fullview.jpg',
      stored_file: 'e5/e5ab66b699da74124452da511ca7481d120b1fc8.jpg',
      mime_type: 'image/jpeg',
      content_hash: 'e5ab66b699da74124452da511ca7481d120b1fc8',
    },
    {
      id: 'a4671240-c3d1-4d6a-a45e-6d669a96b684',
      original_filename: 'de37q7c.jpg',
      stored_file: '86/8667e00dc3dd2474d14f4048fc302196188fcca9.jpg',
      mime_type: 'image/jpeg',
      content_hash: '8667e00dc3dd2474d14f4048fc302196188fcca9',
    },
    {
      id: '88b74a91-1a2e-4ae6-8cde-9b73c5447637',
      original_filename: 'srigi-avatar.png',
      stored_file: '75/75303f22ffd3e75850cfc8fac12b6e254c3ec0a3.png',
      mime_type: 'image/png',
      content_hash: '75303f22ffd3e75850cfc8fac12b6e254c3ec0a3',
    },
    {
      id: 'd67627e9-8ba2-4f39-885b-11a600fd5777',
      original_filename: 'php-deployer.png',
      stored_file: 'd9/d932fc7adc28a070fc906f93030fc4f1db8dea77.png',
      mime_type: 'image/png',
      content_hash: 'd932fc7adc28a070fc906f93030fc4f1db8dea77',
    },
  ]);

  await knex('post').insert([
    {
      id: '184aa581-9345-4912-87c2-46870e6a557d',
      creator_id: 2,
      local_image_id: '076f972b-79ce-4d68-b891-cce9b7c3fd43',
      work_id: 'b7365c11-6ede-43b8-a202-b11f65b91b3e',
      language: 'english',
      content_text: 'Maecenas sollicitudin sollicitudin arcu.',
      is_public: true,
    },
    {
      id: '3772b05c-fe51-45f1-a7f1-b03542f921ee',
      creator_id: 1,
      local_image_id: 'a4671240-c3d1-4d6a-a45e-6d669a96b684',
      work_id: 'ff2a05a8-4d61-4cb0-9e07-373d13dfa86c',
      language: 'english',
      content_text: 'Fan who like star wars.',
      is_public: true,
    },
    {
      id: '0c255337-7430-41c8-b878-38840bb1f1fa',
      creator_id: 1,
      local_image_id: '42cd3b68-58e3-4238-b0be-d3a1b9c17a4f',
      work_id: '73bfee7a-e313-4e6f-918b-753ba0e5c9cd',
      language: 'english',
      is_public: true,
    },
    {
      id: '5d32b7a7-7d8a-4983-b461-8ef8c68206b1',
      creator_id: 1,
      local_image_id: 'afa8cef7-645b-4376-a23a-00b670fdd902',
      work_id: 'faa0a56a-b92a-4e88-a433-a5751204da14',
      language: 'english',
      content_text:
        "Hi ! I can't believe that six months have passed since my last personal artwork ! Anyway I am just on time for #mermay and that's perfect !\n" +
        '\n' +
        "So here's a new addition to my Crystal Mermaid Series, with Emeraude (french for Emerald) I hope you'll enjoy this artwork !\n" +
        '\n' +
        'Thanks to Fuchsfee-Stock for amazing and inspiring reference picture\n' +
        'Snake is by www.deviantart.com/cyborgsuzys…\n' +
        'Tail painted from a Shutterstock reference',
      is_public: true,
    },
    {
      id: '015a2f84-137c-4a6f-89f3-27fa674647fd',
      creator_id: 2,
      local_image_id: 'e4f447f5-644d-4516-8d72-7b6528c1dcbd',
      work_id: '39a57597-6be9-4228-ae30-a588711ea64e',
      language: 'english',
      is_public: true,
    },
    {
      id: 'bfa166ce-a698-43f5-86b4-ba0d3b85de45',
      creator_id: 1,
      local_image_id: '40c41c51-59b0-44ae-8459-346946e0d026',
      work_id: 'aaa7da10-c7f0-44e1-b091-034438ce6ecb',
      language: 'english',
      content_text:
        'I am very excited to share the cover for my new book, "Traveling With Your Octopus" The book is headed off to the printer and is due out this holiday season!.',
      is_public: true,
    },
    {
      id: 'c04aeef8-551b-4fe3-be20-370dddb54981',
      creator_id: 1,
      local_image_id: '58ecae62-d06f-4a66-8321-2bdd49f3efb2',
      work_id: '13bbaa4e-28f7-438e-b39f-2fa77a8893ce',
      language: 'english',
      content_text: 'Fringilla pellentesque et. Vivamus euismod ante et pulvinar imperdiet. Nullam finibus tempus.',
      is_public: true,
    },
    {
      id: 'ae4efae2-de77-499d-81f5-04c7df1ab7c3',
      creator_id: 2,
      local_image_id: 'f53dbaaf-ecf4-421f-90f8-55b7a5d97b68',
      work_id: 'ff2a05a8-4d61-4cb0-9e07-373d13dfa86c',
      language: 'english',
      content_text:
        "I've always wanted to do a piece on this amazing show, and finally got around to doing one. I wanted to do a scene that's not in the show, just to mix things up a bit, as if he's on a bounty to another planet and found himself in a sticky situation.\n" +
        '\n' +
        "This is part of a bunch of new work I'm putting out on Patreon, since Covid this is now my main source of income.\n" +
        'Please consider supporting me on Patreon:\n' +
        'www.patreon.com/patrickbrown\n' +
        "It would mean a lot, and I'm putting out a bunch of bonus content.\n" +
        '\n' +
        'www.instagram.com/patrickbrown…',
      is_public: true,
    },
  ]);

  await knex('cycle').insert([
    {
      id: 'b6a3c0fc-b481-43f1-bae0-11e9a2f44a0a',
      creator_id: 2,
      title: 'Pulp Fiction material gathering',
      languages: JSON.stringify(['english']),
      content_text: 'Lets gather all info about movie',
      start_date: '2020-06-01',
      end_date: '2020-12-31',
    },
    {
      id: 'c37550c9-63fb-48ba-a8ef-f31b7bbffffa',
      creator_id: 1,
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
