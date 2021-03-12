import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/client';
import { Session } from '../../src/types';

import SimpleLayout from '../../src/components/layouts/SimpleLayout';
import WorkDetail from '../../src/components/work/WorkDetail';
import { countCycles, countPosts, find, findAction,
  findFav,
  findLike,
} from '../../src/facades/work';
import { WorkWithImages } from '../../src/types/work';

interface Props {
  work: WorkWithImages;
  cyclesCount: number;
  postsCount: number;
  currentActions: object;
}

const WorkDetailPage: NextPage<Props> = ({
  work,
  cyclesCount, 
  postsCount,
  currentActions
}) => {
  return (
    <SimpleLayout title={work.title}>
      <WorkDetail 
        work={work}
        cyclesCount={cyclesCount}
        postsCount={postsCount} 
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

  const work = await find(id);
  if (work == null) {
    return { notFound: true };
  }

  const cyclesCount = await countCycles(work);
  const postsCount = await countPosts(work);
 let current_actions: { [key: string]: any } = {}
  let user_actions = ['like', 'fav']
  user_actions.forEach(action=>{
    current_actions[action] = null
  })

  const session = (await getSession({ req })) as Session;
  if (session != null) {
    current_actions.like = !!(await findAction(session.user, work, 'liked'));
    current_actions.fav = !!(await findAction(session.user, work, 'fav'));
  }

  return {
    props: {
      work,
      currentActions: current_actions,
      cyclesCount: cyclesCount.count,
      postsCount: postsCount.count,
    },
  };
};

export default WorkDetailPage;
