import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/client';

import { CycleDetail } from '../../src/types/cycle';
import { Session } from '../../src/types';
import SimpleLayout from '../../src/components/layouts/SimpleLayout';
import CycleDetailComponent from '../../src/components/cycle/CycleDetail';
import { 
  countParticipants,
  countPosts,
  countWorks,
  find,
  findAction,
} from '../../src/facades/cycle';

interface Props {
  cycle: CycleDetail;
  participantsCount: number;
  postsCount: number;
  worksCount: number;
  currentActions: object;
}

const CycleDetailPage: NextPage<Props> = ({
  cycle,
  participantsCount,
  postsCount,
  worksCount,
  currentActions,
}) => {
  return (
    <SimpleLayout title={cycle.title}>
      <CycleDetailComponent
        cycle={cycle}
        participantsCount={participantsCount}
        postsCount={postsCount}
        worksCount={worksCount}
        currentActions={currentActions}
        currentActionsPost={currentActions}
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
  var current_actions: { [key: string]: any } = {};
  let user_actions = ['like', 'fav', 'joined']
  user_actions.forEach((action: string)=>{
    current_actions[action] = null
  })

  const session = (await getSession({ req })) as Session;
  const has_session = session != null

  if (has_session) {
    current_actions.like = !!(await findAction(session.user, cycle, 'liked'));
    current_actions.fav = !!(await findAction(session.user, cycle, 'fav'));
    current_actions.joined = !!(await findAction(session.user, cycle, 'joined'));
  }

  return {
    props: {
      cycle,
      currentActions: current_actions,
      participantsCount: participantsCount.count,
      postsCount: postsCount.count,
      worksCount: worksCount.count,
    },
  };
};

export default CycleDetailPage;
