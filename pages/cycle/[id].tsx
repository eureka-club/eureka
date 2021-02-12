import { Prisma } from '@prisma/client';
import { GetServerSideProps, NextPage } from 'next';

import DetailLayout from '../../src/components/layouts/DetailLayout';
import CycleDetail from '../../src/components/cycle/CycleDetail';
import { countPosts, countWorks, find } from '../../src/facades/cycle';

interface Props {
  cycle: Prisma.CycleGetPayload<{
    include: {
      creator: true;
      localImages: true;
    };
  }>;
  postsCount: number;
  worksCount: number;
}

const PostDetailPage: NextPage<Props> = ({ cycle, postsCount, worksCount }) => {
  return (
    <DetailLayout title={cycle.title}>
      <CycleDetail cycle={cycle} postsCount={postsCount} worksCount={worksCount} />
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

  const postsCount = await countPosts(cycle);
  const worksCount = await countWorks(cycle);

  return {
    props: {
      cycle,
      postsCount: postsCount.count,
      worksCount: worksCount.count,
    },
  };
};

export default PostDetailPage;
