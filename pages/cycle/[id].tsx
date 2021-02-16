import { GetServerSideProps, NextPage } from 'next';

import { CycleDetail } from '../../src/types/cycle';
import SimpleLayout from '../../src/components/layouts/SimpleLayout';
import CycleDetailComponent from '../../src/components/cycle/CycleDetail';
import { countPosts, countWorks, find } from '../../src/facades/cycle';

interface Props {
  cycle: CycleDetail;
  postsCount: number;
  worksCount: number;
}

const CycleDetailPage: NextPage<Props> = ({ cycle, postsCount, worksCount }) => {
  return (
    <SimpleLayout title={cycle.title}>
      <CycleDetailComponent cycle={cycle} postsCount={postsCount} worksCount={worksCount} />
    </SimpleLayout>
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

export default CycleDetailPage;
