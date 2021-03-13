import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/client';
import { Session } from '../../../../src/types';

import { PostDetail } from '../../../../src/types/post';
import { WorkWithImages } from '../../../../src/types/work';
import PopupLayout from '../../../../src/components/layouts/PopupLayout';
import WorkDetail from '../../../../src/components/work/WorkDetail';
import { 
  search as searchPost,
  findAction as findActionPost,
} from '../../../../src/facades/post';
import { 
  countCycles,
  countPosts,
  find as findWork,
  findAction as findActionWork,
} from '../../../../src/facades/work';

interface Props {
  post: PostDetail;
  work: WorkWithImages;
  cyclesCount: number;
  postsCount: number;
  currentActions:  { [key: string]: boolean };
  currentActionsPost:  { [key: string]: boolean };
}

const PostDetailInWorkPage: NextPage<Props> = ({
  post,
  work,
  cyclesCount,
  postsCount,
  currentActions,
  currentActionsPost,
}) => {
  return (
    <PopupLayout title={`${post.title} · ${work.title}`}>
      <WorkDetail
        work={work}
        post={post}
        cyclesCount={cyclesCount}
        postsCount={postsCount} 
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
  const workId = parseInt(params.id, 10);
  const postId = parseInt(params.postId, 10);

  if (!Number.isInteger(workId) || !Number.isInteger(postId)) {
    return { notFound: true };
  }

  const work = await findWork(workId);
  if (work == null) {
    return { notFound: true };
  }

  const postResults = (await searchPost({
    where: JSON.stringify({
      works: { some: { id: workId } },
      id: postId,
    }),
    include: JSON.stringify({
      creator: true,
      cycles: true,
      localImages: true,
      likes: true,
      favs: true,
    }),
  })) as PostDetail[];
  if (postResults.length === 0) {
    return { notFound: true };
  }

  const cyclesCount = await countCycles(work);
  const postsCount = await countPosts(work);
  var current_actions: { [key: string]: boolean } = {};
  var current_actions_post: { [key: string]: boolean } = {};
  let user_actions = ['like', 'fav']
  user_actions.forEach(action=>{
    current_actions[action] = false
    current_actions_post[action] = false
  })

  const current_post = postResults[0]

  const session = (await getSession({ req })) as Session;
  if (session != null) {
    current_actions.like = !!(await findActionWork(session.user, work, 'liked'));
    current_actions.fav = !!(await findActionWork(session.user, work, 'fav'));
    current_actions_post.like = !!(await findActionPost(session.user, current_post, 'liked'));
    current_actions_post.fav = !!(await findActionPost(session.user, current_post, 'fav'));
  }

  return {
    props: {
      work,
      post: current_post,
      cyclesCount: cyclesCount.count,
      postsCount: postsCount.count,
      currentActions: current_actions,
      currentActionsPost: current_actions_post,
    },
  };
};

export default PostDetailInWorkPage;
