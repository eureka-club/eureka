import { GetServerSideProps, NextPage } from 'next';
import { LocalImage, Work } from '@prisma/client';

import DetailLayout from '../../components/layouts/DetailLayout';
import WorkDetail from '../../components/WorkDetail';
import { findOne } from '../../facades/work';

interface Props {
  work: Work & {
    localImages: LocalImage[];
  };
}

const WorkDetailPage: NextPage<Props> = ({ work }) => {
  return (
    <DetailLayout>
      <WorkDetail work={work} />
    </DetailLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if (ctx.params?.id == null || typeof ctx.params.id !== 'string') {
    return { notFound: true };
  }

  const id = parseInt(ctx.params.id, 10);
  if (typeof id !== 'number') {
    return { notFound: true };
  }

  const work = await findOne(id);
  if (work == null) {
    return { notFound: true };
  }

  return {
    props: { work },
  };
};

export default WorkDetailPage;
