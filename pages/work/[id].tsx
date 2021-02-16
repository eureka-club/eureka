import { GetServerSideProps, NextPage } from 'next';

import SimpleLayout from '../../src/components/layouts/SimpleLayout';
import WorkDetail from '../../src/components/work/WorkDetail';
import { countCycles, countPosts, find } from '../../src/facades/work';
import { WorkWithImages } from '../../src/types/work';

interface Props {
  work: WorkWithImages;
  cyclesCount: number;
  postsCount: number;
}

const WorkDetailPage: NextPage<Props> = ({ work, cyclesCount, postsCount }) => {
  return (
    <SimpleLayout title={work.title}>
      <WorkDetail work={work} cyclesCount={cyclesCount} postsCount={postsCount} />
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

  const work = await find(id);
  if (work == null) {
    return { notFound: true };
  }

  const cyclesCount = await countCycles(work);
  const postsCount = await countPosts(work);

  return {
    props: {
      work,
      cyclesCount: cyclesCount.count,
      postsCount: postsCount.count,
    },
  };
};

export default WorkDetailPage;
