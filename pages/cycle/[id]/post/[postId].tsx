import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/client';

import { MySocialInfo, Session } from '../../../../src/types';
import { CycleDetail } from '../../../../src/types/cycle';
import { PostDetail } from '../../../../src/types/post';
import SimpleLayout from '../../../../src/components/layouts/SimpleLayout';
import CycleDetailComponent from '../../../../src/components/cycle/CycleDetail';
import {
  countParticipants,
  countPosts,
  countWorks,
  find as findCycle,
  findParticipant,
} from '../../../../src/facades/cycle';
import { isFavoritedByUser, isLikedByUser, search as searchPost } from '../../../../src/facades/post';

interface Props {
  cycle: CycleDetail;
  post: PostDetail;
  isCurrentUserJoinedToCycle: boolean;
  participantsCount: number;
  postsCount: number;
  worksCount: number;
  mySocialInfo: MySocialInfo;
}

const PostDetailInCyclePage: NextPage<Props> = ({
  cycle,
  post,
  isCurrentUserJoinedToCycle,
  participantsCount,
  postsCount,
  worksCount,
  mySocialInfo,
}) => {
  return (
    <SimpleLayout title={`${post.title} · ${cycle.title}`}>
      <CycleDetailComponent
        cycle={cycle}
        post={post}
        isCurrentUserJoinedToCycle={isCurrentUserJoinedToCycle}
        participantsCount={participantsCount}
        postsCount={postsCount}
        worksCount={worksCount}
        mySocialInfo={mySocialInfo}
      />
    </SimpleLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {
  if (
    params == null ||
    params.id == null ||
    params.postId == null ||
    typeof params.id !== 'string' ||
    typeof params.postId !== 'string'
  ) {
    return { notFound: true };
  }
  const cycleId = parseInt(params.id, 10);
  const postId = parseInt(params.postId, 10);

  if (!Number.isInteger(cycleId) || !Number.isInteger(postId)) {
    return { notFound: true };
  }

  const cycle = await findCycle(cycleId);
  if (cycle == null) {
    return { notFound: true };
  }

  const postResults = (await searchPost({
    where: JSON.stringify({
      cycles: { some: { id: cycleId } },
      id: postId,
    }),
    include: JSON.stringify({
      creator: true,
      cycles: true,
      localImages: true,
      favs: true,
      likes: true,
    }),
  })) as PostDetail[];
  if (postResults.length === 0) {
    return { notFound: true };
  }

  const participantsCount = await countParticipants(cycle);
  const postsCount = await countPosts(cycle);
  const worksCount = await countWorks(cycle);

  const session = (await getSession({ req })) as unknown as Session;
  const mySocialInfo: MySocialInfo = {
    favoritedByMe: undefined,
    likedByMe: undefined,
  };
  let myParticipant = null;
  if (session != null) {
    myParticipant = await findParticipant(session.user, cycle);
    mySocialInfo.favoritedByMe = !!(await isFavoritedByUser(postResults[0], session.user));
    mySocialInfo.likedByMe = !!(await isLikedByUser(postResults[0], session.user));
  }

  return {
    props: {
      cycle,
      post: postResults[0],
      isCurrentUserJoinedToCycle: myParticipant != null,
      participantsCount: participantsCount.count,
      postsCount: postsCount.count,
      worksCount: worksCount.count,
      mySocialInfo,
    },
  };
};

export default PostDetailInCyclePage;
