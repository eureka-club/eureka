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
      id: 'd906c2a8-0ce0-44ed-a125-a7414864cc30',
      original_filename: 'amelie.jpg',
      stored_file: '61/61893673dd5f370f752d978658083989fe98c282.jpg',
      mime_type: 'image/jpeg',
      content_hash: '61893673dd5f370f752d978658083989fe98c282',
    },
    {
      id: '7463da92-7c7d-4cfa-ba76-835e256ccdc4',
      original_filename: 'moonlight.jpg',
      stored_file: '81/81bd9a7f6f2847b38e00f13c89ae9024cafec61d.jpg',
      mime_type: 'image/jpeg',
      content_hash: '81bd9a7f6f2847b38e00f13c89ae9024cafec61d',
    },
    {
      id: '40c41c51-59b0-44ae-8459-346946e0d026',
      original_filename: 'traveling-with-your-octopus.jpg',
      stored_file: '80/803f3108aa70a655cf54caefce3c449328f59b0e.jpg',
      mime_type: 'image/jpeg',
      content_hash: '803f3108aa70a655cf54caefce3c449328f59b0e',
    },
    {
      id: '16dbfe4b-7ce4-4e80-9083-34b2af08b075',
      original_filename: 'The Marauders.jpg',
      stored_file: '0a/0a89dc1d4599e8da435256f507db0d93e81dd9bc.jpg',
      mime_type: 'image/jpeg',
      content_hash: '0a89dc1d4599e8da435256f507db0d93e81dd9bc',
    },
    {
      id: '3b0a062c-3a71-4be9-8f26-06dca6428415',
      original_filename: 'Protect_her.jpg',
      stored_file: '7e/7eb93345023a62f6b6ce6d2fa8db9d02e8670917.jpg',
      mime_type: 'image/jpeg',
      content_hash: '7eb93345023a62f6b6ce6d2fa8db9d02e8670917',
    },
    {
      id: 'e4f447f5-644d-4516-8d72-7b6528c1dcbd',
      original_filename: 'ironman-cover.jpg',
      stored_file: '36/369f1314cc1f42b4e66f552b134eedae6e29a5a5.jpg',
      mime_type: 'image/jpeg',
      content_hash: '369f1314cc1f42b4e66f552b134eedae6e29a5a5',
    },
    {
      id: 'b3a2035c-f2cb-42fa-a513-9701f6681fd4',
      original_filename: 'mafia princess2.jpg',
      stored_file: 'be/be9d5e08e0a10c4d7af4e5684952c86293fdc586.jpg',
      mime_type: 'image/jpeg',
      content_hash: 'be9d5e08e0a10c4d7af4e5684952c86293fdc586',
    },
    {
      id: 'bfd7add8-440d-42dd-872b-868323a372a0',
      original_filename: 'Sean Connory.jpg',
      stored_file: '8a/8aa4f6a825419b7084d458da61074573a710a4b9.jpg',
      mime_type: 'image/jpeg',
      content_hash: '8aa4f6a825419b7084d458da61074573a710a4b9',
    },
    {
      id: '2b8f0862-80aa-43c8-a373-9c52eb918447',
      original_filename: 'magic_night.png',
      stored_file: '0d/0d70200e50a969c6cbd340512ccc0b55d090ee5d.png',
      mime_type: 'image/png',
      content_hash: '0d70200e50a969c6cbd340512ccc0b55d090ee5d',
    },
    {
      id: '42cd3b68-58e3-4238-b0be-d3a1b9c17a4f',
      original_filename: 'VR dreams.jpg',
      stored_file: '9d/9dbcd094d58600adc2256cc525fc44326fbc639b.jpg',
      mime_type: 'image/jpeg',
      content_hash: '9dbcd094d58600adc2256cc525fc44326fbc639b',
    },
    {
      id: '58ecae62-d06f-4a66-8321-2bdd49f3efb2',
      original_filename: 'american beauty (cover).jpg',
      stored_file: 'f0/f03942031e7e914d32e67d26091e64b5e300f113.jpg',
      mime_type: 'image/jpeg',
      content_hash: 'f03942031e7e914d32e67d26091e64b5e300f113',
    },
    {
      id: '4b7e474e-d180-46e5-8853-4062fb4761c5',
      original_filename: 'The Moth and the Flame.jpg',
      stored_file: 'd7/d70077bcb14972553bfabade65637837e81a04e0.jpg',
      mime_type: 'image/jpeg',
      content_hash: 'd70077bcb14972553bfabade65637837e81a04e0',
    },
  ]);
}
