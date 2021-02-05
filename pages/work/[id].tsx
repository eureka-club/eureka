import { GetServerSideProps, NextPage } from 'next';
import { LocalImage, Work } from '@prisma/client';

import DetailLayout from '../../src/components/layouts/DetailLayout';
import WorkDetail from '../../src/components/work/WorkDetail';
import { find } from '../../src/facades/work';

interface Props {
  work: Work & {
    localImages: LocalImage[];
  };
}

const WorkDetailPage: NextPage<Props> = ({ work }) => {
  return (
    <DetailLayout title={work.title}>
      <WorkDetail work={work} />
    </DetailLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (params?.id == null || typeof params.id !== 'string') {
    return { notFound: true };
  }

  const id = parseInt(params.id, 10);
  if (!Number.isInteger(id)) {
    return { notFound: true };
  }

  const work = await find(id);
  if (work == null) {
    return { notFound: true };
  }

  return {
    props: { work },
  };
};

export default WorkDetailPage;
