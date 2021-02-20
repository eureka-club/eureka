import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/client';

import { CycleDetail } from '../../src/types/cycle';
import { Session } from '../../src/types';
import SimpleLayout from '../../src/components/layouts/SimpleLayout';
import CycleDetailComponent from '../../src/components/cycle/CycleDetail';
import { countParticipants, countPosts, countWorks, find, findParticipant } from '../../src/facades/cycle';

interface Props {
  cycle: CycleDetail;
  isCurrentUserJoinedToCycle: boolean;
  participantsCount: number;
  postsCount: number;
  worksCount: number;
}

const CycleDetailPage: NextPage<Props> = ({
  cycle,
  isCurrentUserJoinedToCycle,
  participantsCount,
  postsCount,
  worksCount,
}) => {
  return (
    <SimpleLayout title={cycle.title}>
      <CycleDetailComponent
        cycle={cycle}
        isCurrentUserJoinedToCycle={isCurrentUserJoinedToCycle}
        participantsCount={participantsCount}
        postsCount={postsCount}
        worksCount={worksCount}
      />
    </SimpleLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {
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
  let myParticipant = null;

  const session = (await getSession({ req })) as Session;
  if (session != null) {
    myParticipant = await findParticipant(session.user, cycle);
  }

  return {
    props: {
      cycle,
      isCurrentUserJoinedToCycle: myParticipant != null,
      participantsCount: participantsCount.count,
      postsCount: postsCount.count,
      worksCount: worksCount.count,
    },
  };
};

export default CycleDetailPage;
