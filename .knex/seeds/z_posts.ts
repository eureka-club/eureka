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
      id: '3772b05c-fe51-45f1-a7f1-b03542f921ee',
      creator_id: '340c3ef1-d00b-4480-b9a3-60ce197fdff8',
      local_image_id: 'a4671240-c3d1-4d6a-a45e-6d669a96b684',
      work_id: 'ff2a05a8-4d61-4cb0-9e07-373d13dfa86c',
      content_text: 'Fan who like star wars.',
    },
    {
      id: '0c255337-7430-41c8-b878-38840bb1f1fa',
      creator_id: '340c3ef1-d00b-4480-b9a3-60ce197fdff8',
      local_image_id: '42cd3b68-58e3-4238-b0be-d3a1b9c17a4f',
      work_id: '73bfee7a-e313-4e6f-918b-753ba0e5c9cd',
      content_text: 'Fringilla pellentesque et. Vivamus euismod ante et pulvinar imperdiet. Nullam finibus tempus.',
    },
    {
      id: '5d32b7a7-7d8a-4983-b461-8ef8c68206b1',
      creator_id: '340c3ef1-d00b-4480-b9a3-60ce197fdff8',
      local_image_id: 'afa8cef7-645b-4376-a23a-00b670fdd902',
      work_id: 'faa0a56a-b92a-4e88-a433-a5751204da14',
      content_text:
        "Hi ! I can't believe that six months have passed since my last personal artwork ! Anyway I am just on time for #mermay and that's perfect !\n" +
        '\n' +
        "So here's a new addition to my Crystal Mermaid Series, with Emeraude (french for Emerald) I hope you'll enjoy this artwork !\n" +
        '\n' +
        'Thanks to Fuchsfee-Stock for amazing and inspiring reference picture\n' +
        'Snake is by www.deviantart.com/cyborgsuzys…\n' +
        'Tail painted from a Shutterstock reference',
    },
    {
      id: '015a2f84-137c-4a6f-89f3-27fa674647fd',
      creator_id: '340c3ef1-d00b-4480-b9a3-60ce197fdff8',
      local_image_id: 'e4f447f5-644d-4516-8d72-7b6528c1dcbd',
      work_id: '39a57597-6be9-4228-ae30-a588711ea64e',
      content_text: 'Fringilla pellentesque et. Vivamus euismod ante et pulvinar imperdiet. Nullam finibus tempus.',
    },
    {
      id: 'bfa166ce-a698-43f5-86b4-ba0d3b85de45',
      creator_id: '340c3ef1-d00b-4480-b9a3-60ce197fdff8',
      local_image_id: '40c41c51-59b0-44ae-8459-346946e0d026',
      work_id: 'aaa7da10-c7f0-44e1-b091-034438ce6ecb',
      content_text:
        'I am very excited to share the cover for my new book, "Traveling With Your Octopus" The book is headed off to the printer and is due out this holiday season!.',
    },
    {
      id: 'c04aeef8-551b-4fe3-be20-370dddb54981',
      creator_id: '2878d482-9922-426d-889e-ab1a816df96a',
      local_image_id: '58ecae62-d06f-4a66-8321-2bdd49f3efb2',
      work_id: '13bbaa4e-28f7-438e-b39f-2fa77a8893ce',
      content_text: 'Fringilla pellentesque et. Vivamus euismod ante et pulvinar imperdiet. Nullam finibus tempus.',
    },
    {
      id: 'ae4efae2-de77-499d-81f5-04c7df1ab7c3',
      creator_id: '2878d482-9922-426d-889e-ab1a816df96a',
      local_image_id: 'f53dbaaf-ecf4-421f-90f8-55b7a5d97b68',
      work_id: 'ff2a05a8-4d61-4cb0-9e07-373d13dfa86c',
      content_text:
        "I've always wanted to do a piece on this amazing show, and finally got around to doing one. I wanted to do a scene that's not in the show, just to mix things up a bit, as if he's on a bounty to another planet and found himself in a sticky situation.\n" +
        '\n' +
        "This is part of a bunch of new work I'm putting out on Patreon, since Covid this is now my main source of income.\n" +
        'Please consider supporting me on Patreon:\n' +
        'www.patreon.com/patrickbrown\n' +
        "It would mean a lot, and I'm putting out a bunch of bonus content.\n" +
        '\n' +
        'www.instagram.com/patrickbrown…',
    },
  ]);
}
