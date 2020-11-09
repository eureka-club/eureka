import { NextPage } from 'next';

import Mosaic from '../components/Mosaic';
import SimpleLayout from '../components/layouts/SimpleLayout';

const IndexPage: NextPage = () => {
  return (
    <SimpleLayout title="Welcome">
      <Mosaic
        stock={[
          {
            kind: 'cycle',
            id: 'DiItGE3eAyQ',
            title: 'Pulp fiction night',
            startDate: 'Jul 17 2020',
            endDate: 'Oct 13 2020',
            image: '4b205649.jpg',
            bookmarked: true,
          },
          {
            kind: 'post',
            id: 'p7bfOZek9t4',
            title: 'Magic night',
            author: 'DAV-19',
            image: 'de7q9kj.png',
            liked: true,
          },
          {
            kind: 'post',
            id: 'gFZfwWZV074',
            title: 'Sean Connory',
            author: 'KristofferNS',
            image: 'd2h6b51.jpg',
            liked: true,
            bookmarked: true,
          },
          {
            kind: 'post',
            id: '0VR3dfZf9Yg',
            title: 'Moonlight',
            author: 'TamplierPainter',
            image: 'b5e80tgi.jpg',
            bookmarked: true,
          },
          {
            kind: 'post',
            id: 'w2C6RhQBYlg',
            title: 'Amelie',
            author: 'Kuvshinov-Ilya',
            image: 'a726748395.jpg',
          },
          {
            kind: 'post',
            id: 'Pkh8UtuejGw',
            title: 'The marauders',
            author: 'kanae',
            image: 'c6078e839.jpg',
            bookmarked: true,
          },
          {
            kind: 'cycle',
            id: 'ZlxIEWygQYY',
            title: 'Iron man',
            startDate: 'Jan 1 2020',
            endDate: 'Dec 31 2020',
            image: 'cwMTU0NTIzM.jpg',
            bookmarked: true,
          },
          {
            kind: 'post',
            id: 'Q4Pf6zEcoyU',
            title: 'Traveling with your octopus',
            author: 'BrianKesinger',
            image: 'b7vof0q.jpg',
            liked: true,
          },
          {
            kind: 'post',
            id: 'x6Q7c9RyMzk',
            title: 'Mafia princess 2',
            author: 'raykit',
            image: 'd253bmh.jpg',
          },
          {
            kind: 'post',
            id: 'XqkDeM8Rbkg',
            title: 'The Moth and the flame',
            author: 'StressedJenny',
            image: 's3a2bzti.jpg',
          },
          {
            kind: 'post',
            id: '2S24-y0Ij3Y',
            title: 'Protect her',
            author: 'Mihaela-V',
            image: 'cb69652cc4.jpg',
          },
          {
            kind: 'cycle',
            id: 'DyDfgMOUjCI',
            title: 'American beauty',
            startDate: 'May 1 2020',
            endDate: 'May 31 2020',
            image: 'mrcnbat19rilt0x.jpg',
            liked: true,
          },
          {
            kind: 'post',
            id: 'QYh6mYIJG2Y',
            title: 'VR Dreams',
            author: 'Thorsten-Denk',
            image: 'eb7b4819e.jpg',
            bookmarked: true,
          },
        ]}
      />
    </SimpleLayout>
  );
};

export default IndexPage;
