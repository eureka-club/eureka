import { GetServerSideProps, NextPage } from 'next';

import DetailLayout from '../../src/components/layouts/DetailLayout';
import WorkDetail from '../../src/components/work/WorkDetail';
import { countPosts, find } from '../../src/facades/work';
import { WorkWithImages } from '../../src/types/work';

interface Props {
  work: WorkWithImages;
  postsCount: number;
}

const WorkDetailPage: NextPage<Props> = ({ work, postsCount }) => {
  return (
    <DetailLayout title={work.title}>
      <WorkDetail work={work} postsCount={postsCount} />
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

  const postsCount = await countPosts(work);

  return {
    props: {
      work,
      postsCount: postsCount.count,
    },
  };
};

export default WorkDetailPage;
