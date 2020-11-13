import * as Knex from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('local_image').del();

  // Inserts seed entries
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
  ]);
}
