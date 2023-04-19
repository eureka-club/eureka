import { LocalImage, Work } from '@prisma/client';
import dayjs from 'dayjs';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

import Table from 'react-bootstrap/Table';
import { QueryClient, useMutation, dehydrate, useQuery } from 'react-query';

import { DATE_FORMAT_ONLY_YEAR } from '@/src/constants';
import { Session } from '@/src/types';
import SimpleLayout from '@/src/components/layouts/SimpleLayout';
import LocalImageComponent from '@/src/components/LocalImage';
import { findAll } from '@/src/facades/work';
import { getWorks } from '@/src/useWorks';
import useWorks from '@/src/useWorks';

interface Props {
  // works: (Work & {
  //   localImages: LocalImage[];
  // })[];
  session:Session
}

const ListWorksPage: NextPage<Props> = ({ session }) => {
  const router = useRouter();
  const {data} = useWorks();
  const works = data?.works.filter(x => x.ToCheck)

  const { mutate: execDeleteWork, isSuccess: isDeleteWorkSucces } = useMutation(async (work: Work) => {
    const res = await fetch(`/api/work/${work.id}`, {
      method: 'delete',
    });
    const data = await res.json();

    return data;
  });

  const handleDeleteClick = (work: Work) => {
    execDeleteWork(work);
  };

  useEffect(() => {
    if (isDeleteWorkSucces === true) {
      router.replace(router.asPath);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeleteWorkSucces]);

  return (
    <SimpleLayout title="Works library">
      <h1 style={{ marginBottom: '2rem' }}>Works library</h1>
      {works ?
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
                  height={96}
                  filePath={work.localImages[0].storedFile}
                  style={{marginRight: '1rem' }}
                />
              </td>
              <td>{work.type}</td>
              <td>{work.title}</td>
              <td>{work.author}</td>
              <td>{work.publicationYear && dayjs(work.publicationYear).format(DATE_FORMAT_ONLY_YEAR)}</td>
              <td>
                <Link href={`/work/${work.id}`}>
                  <a>detail</a>
                </Link>

                <OverlayTrigger
                  trigger="click"
                  placement="bottom"
                  transition={false}
                  overlay={
                    <Popover id="confirmDelete">
                      <Popover.Body>
                        <Button variant="danger" onClick={() => handleDeleteClick(work)}>
                          confirm delete!!!
                        </Button>
                      </Popover.Body>
                    </Popover>
                  }
                >
                  <Button variant="link" className="ms-2">
                    delete?
                  </Button>
                </OverlayTrigger>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      : <>...</>}
    </SimpleLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = (await getSession(ctx)) as unknown as Session;
  if (session == null || !session.user.roles.includes('admin')) {
    return { notFound: true };
  }
  const origin = process.env.NEXT_PUBLIC_WEBAPP_URL;
  const qc = new QueryClient();
  const worksData = await getWorks(undefined, origin);
  qc.prefetchQuery('list/works', () => worksData);

  return {
    props: {
      session,
      dehydratedState: dehydrate(qc),
    },
  };
};

export default ListWorksPage;
