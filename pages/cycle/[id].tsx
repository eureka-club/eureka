import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/client';

import { CycleDetail } from '../../src/types/cycle';
import { MySocialInfo, Session } from '../../src/types';
import SimpleLayout from '../../src/components/layouts/SimpleLayout';
import CycleDetailComponent from '../../src/components/cycle/CycleDetail';
import {
  countParticipants,
  countPosts,
  countWorks,
  find,
  findParticipant,
  isFavoritedByUser,
  isLikedByUser,
} from '../../src/facades/cycle';

interface Props {
  cycle: CycleDetail;
  isCurrentUserJoinedToCycle: boolean;
  participantsCount: number;
  postsCount: number;
  worksCount: number;
  mySocialInfo: MySocialInfo;
}

const CycleDetailPage: NextPage<Props> = ({
  cycle,
  isCurrentUserJoinedToCycle,
  participantsCount,
  postsCount,
  worksCount,
  mySocialInfo,
}) => {
  return (
    <SimpleLayout title={cycle.title}>
      <CycleDetailComponent
        cycle={cycle}
        isCurrentUserJoinedToCycle={isCurrentUserJoinedToCycle}
        participantsCount={participantsCount}
        postsCount={postsCount}
        worksCount={worksCount}
        mySocialInfo={mySocialInfo}
      />
    </SimpleLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params, req, res }) => {
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

  const session = (await getSession({ req })) as Session;

  const mySocialInfo: MySocialInfo = {
    favoritedByMe: undefined,
    likedByMe: undefined,
  };
  let myParticipant = null;

  const toHomePage = () => {
    res.writeHead(302, { Location: '/' });
    res.end();
  };
  if (!cycle.isPublic) {
    if (!session) {
      toHomePage();
    }/*  else {
      const participantIdx = cycle.participants.findIndex((i) => i.id === session.user.id);
      if ((cycle.creatorId !== session.user.id && participantIdx === -1) || !session.user.roles.includes('admin')) {
        toHomePage();
      }
    } */
  }

  if (session != null) {
    myParticipant = await findParticipant(session.user, cycle);
    mySocialInfo.favoritedByMe = !!(await isFavoritedByUser(cycle, session.user));
    mySocialInfo.likedByMe = !!(await isLikedByUser(cycle, session.user));
  }

  return {
    props: {
      cycle,
      isCurrentUserJoinedToCycle: myParticipant != null,
      participantsCount: participantsCount.count,
      postsCount: postsCount.count,
      worksCount: worksCount.count,
      mySocialInfo,
    },
  };
};

export default CycleDetailPage;
