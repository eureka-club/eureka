import { Cycle, LocalImage, User } from '@prisma/client';
import { GetServerSideProps, NextPage } from 'next';

import { WorkWithImage } from '../../src/types/work';
import DetailLayout from '../../src/components/layouts/DetailLayout';
import CycleDetail from '../../src/components/cycle/CycleDetail';
import { find } from '../../src/facades/cycle';

interface Props {
  cycle: Cycle & {
    creator: User;
    localImages: LocalImage[];
    works: WorkWithImage[];
  };
}

const PostDetailPage: NextPage<Props> = ({ cycle }) => {
  return (
    <DetailLayout title={cycle.title}>
      <CycleDetail cycle={cycle} />
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

  const cycle = await find(id);
  if (cycle == null) {
    return { notFound: true };
  }

  return {
    props: {
      cycle,
    },
  };
};

export default PostDetailPage;
