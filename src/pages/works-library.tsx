import { LocalImage, Work } from '@prisma/client';
import dayjs from 'dayjs';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import Table from 'react-bootstrap/Table';

import SimpleLayout from '../components/layouts/SimpleLayout';
import LocalImageComponent from '../components/LocalImage';
import { fetchWorks } from '../facades/work';

interface Props {
  works: (Work & {
    localImages: LocalImage[];
  })[];
}

const WorksLibraryPage: NextPage<Props> = ({ works }) => {
  return (
    <SimpleLayout title="Works library">
      <h1 style={{ marginBottom: '2rem' }}>Works library</h1>

      <Table>
        <thead>
          <tr>
            <th>&nbsp;</th>
            <th>type</th>
            <th>title</th>
            <th>author</th>
            <th>publication year</th>
            <th>[actions]</th>
          </tr>
        </thead>
        <tbody>
          {works.map((work) => (
            <tr key={work.id}>
              <td>
                <LocalImageComponent
                  alt="work cover"
                  filePath={work.localImages[0].storedFile}
                  style={{ height: '96px', marginRight: '1rem' }}
                />
              </td>
              <td>{work.type}</td>
              <td>{work.title}</td>
              <td>{work.author}</td>
              <td>{work.publicationYear && dayjs(work.publicationYear).format('YYYY')}</td>
              <td>
                <Link href={`/work/${work.id}`}>
                  <a>detail</a>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </SimpleLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const storedWorks = await fetchWorks();

  return {
    props: {
      works: storedWorks,
    },
  };
};

export default WorksLibraryPage;
