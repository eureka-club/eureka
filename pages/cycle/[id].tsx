import { GetServerSideProps, NextPage } from 'next';

import { CycleDetail } from '../../src/types/cycle';
import SimpleLayout from '../../src/components/layouts/SimpleLayout';
import CycleDetailComponent from '../../src/components/cycle/CycleDetail';
import { countParticipants, countPosts, countWorks, find } from '../../src/facades/cycle';

interface Props {
  cycle: CycleDetail;
  participantsCount: number;
  postsCount: number;
  worksCount: number;
}

const CycleDetailPage: NextPage<Props> = ({ cycle, participantsCount, postsCount, worksCount }) => {
  return (
    <SimpleLayout title={cycle.title}>
      <CycleDetailComponent
        cycle={cycle}
        participantsCount={participantsCount}
        postsCount={postsCount}
        worksCount={worksCount}
      />
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

  const participantsCount = await countParticipants(cycle);
  const postsCount = await countPosts(cycle);
  const worksCount = await countWorks(cycle);

  return {
    props: {
      cycle,
      participantsCount: participantsCount.count,
      postsCount: postsCount.count,
      worksCount: worksCount.count,
    },
  };
};

export default CycleDetailPage;
