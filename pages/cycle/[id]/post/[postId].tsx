import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/client';

import { CycleDetail } from '../../../../src/types/cycle';
import { PostDetail } from '../../../../src/types/post';
import { Session } from '../../../../src/types';
import PopupLayout from '../../../../src/components/layouts/PopupLayout';
import CycleDetailComponent from '../../../../src/components/cycle/CycleDetail';
import {
  countParticipants,
  countPosts,
  countWorks,
  find as findCycle,
  findParticipant,
} from '../../../../src/facades/cycle';
import {
  search as searchPost,
  findLike as findLikePost,
  findFav as findFavPost,
  findAction,
} from '../../../../src/facades/post';

interface Props {
  cycle: CycleDetail;
  post: PostDetail;
  //isCurrentUserJoinedToCycle: boolean;
  participantsCount: number;
  postsCount: number;
  worksCount: number;
  currentActions: object;
  currentActionsPost: object;
}

const PostDetailInCyclePage: NextPage<Props> = ({
  cycle,
  post,
  //isCurrentUserJoinedToCycle,
  participantsCount,
  postsCount,
  worksCount,
  currentActions,
  currentActionsPost,
}) => {
  return (
    <PopupLayout title={`${post.title} · ${cycle.title}`}>
      <CycleDetailComponent
        cycle={cycle}
        //isCurrentUserJoinedToCycle={isCurrentUserJoinedToCycle}
        participantsCount={participantsCount}
        post={post}
        postsCount={postsCount}
        worksCount={worksCount}
        currentActions={currentActions}
        currentActionsPost={currentActionsPost}
      />
    </PopupLayout>
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
  let myParticipant, myLike, myFav = null;
  const currPost = postResults[0]
  const current_post = postResults[0]


  let current_actions = {}
  let user_actions = ['like', 'fav']
  user_actions.forEach(action=>{
    current_actions[action] = null
  })


  const session = (await getSession({ req })) as Session;
  if (session != null) {
    current_actions.like = !!(await findAction(session.user, current_post, 'liked'));
    current_actions.fav = !!(await findAction(session.user, current_post, 'fav'));
    myParticipant = await findParticipant(session.user, cycle);
    //myLike = await findLikePost(session.user, current_post);
    //myFav = await findFavPost(session.user, current_post);
  }

  return {
    props: {
      cycle,
      post: current_post,
      //isCurrentUserJoinedToCycle: myParticipant != null,
      participantsCount: participantsCount.count,
      postsCount: postsCount.count,
      worksCount: worksCount.count,
      currentActions: current_actions,
      currentActionsPost: current_actions,
    },
  };
};

export default PostDetailInCyclePage;
