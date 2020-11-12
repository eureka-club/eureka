import * as Knex from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('post').del();

  // Inserts seed entries
  await knex('post').insert([
    {
      id: '184aa581-9345-4912-87c2-46870e6a557d',
      creator_id: '340c3ef1-d00b-4480-b9a3-60ce197fdff8',
      local_image_id: '076f972b-79ce-4d68-b891-cce9b7c3fd43',
      work_id: 'b7365c11-6ede-43b8-a202-b11f65b91b3e',
      content_text: 'Maecenas sollicitudin sollicitudin arcu.',
    },
    {
      id: '0c255337-7430-41c8-b878-38840bb1f1fa',
      creator_id: '340c3ef1-d00b-4480-b9a3-60ce197fdff8',
      local_image_id: '42cd3b68-58e3-4238-b0be-d3a1b9c17a4f',
      work_id: '73bfee7a-e313-4e6f-918b-753ba0e5c9cd',
      content_text: 'Fringilla pellentesque et. Vivamus euismod ante et pulvinar imperdiet. Nullam finibus tempus.',
    },
    {
      id: '015a2f84-137c-4a6f-89f3-27fa674647fd',
      creator_id: '340c3ef1-d00b-4480-b9a3-60ce197fdff8',
      local_image_id: 'e4f447f5-644d-4516-8d72-7b6528c1dcbd',
      work_id: '39a57597-6be9-4228-ae30-a588711ea64e',
      content_text: 'Fringilla pellentesque et. Vivamus euismod ante et pulvinar imperdiet. Nullam finibus tempus.',
    },
    {
      id: 'c04aeef8-551b-4fe3-be20-370dddb54981',
      creator_id: '2878d482-9922-426d-889e-ab1a816df96a',
      local_image_id: '58ecae62-d06f-4a66-8321-2bdd49f3efb2',
      work_id: '13bbaa4e-28f7-438e-b39f-2fa77a8893ce',
      content_text: 'Fringilla pellentesque et. Vivamus euismod ante et pulvinar imperdiet. Nullam finibus tempus.',
    },
  ]);
}
