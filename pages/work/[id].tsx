import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/client';

import { Session, MySocialInfo } from '../../src/types';
import { WorkDetail } from '../../src/types/work';
import SimpleLayout from '../../src/components/layouts/SimpleLayout';
import WorkDetailComponent from '../../src/components/work/WorkDetail';
import { countCycles, countPosts, find, isFavoritedByUser, isLikedByUser } from '../../src/facades/work';

interface Props {
  work: WorkDetail;
  cyclesCount: number;
  postsCount: number;
  mySocialInfo: MySocialInfo;
}

const WorkDetailPage: NextPage<Props> = ({ work, cyclesCount, postsCount, mySocialInfo }) => {
  return (
    <SimpleLayout title={work.title}>
      <WorkDetailComponent work={work} cyclesCount={cyclesCount} postsCount={postsCount} mySocialInfo={mySocialInfo} />
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

  const session = (await getSession({ req })) as unknown as Session;
  const mySocialInfo: MySocialInfo = {
    favoritedByMe: undefined,
    likedByMe: undefined,
  };
  if (session != null) {
    mySocialInfo.favoritedByMe = !!(await isFavoritedByUser(work, session.user));
    mySocialInfo.likedByMe = !!(await isLikedByUser(work, session.user));
  }

  return {
    props: {
      work,
      cyclesCount: cyclesCount.count,
      postsCount: postsCount.count,
      mySocialInfo,
    },
  };
};

export default WorkDetailPage;
