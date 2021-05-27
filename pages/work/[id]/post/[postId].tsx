import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/client';

import { MySocialInfo, Session } from '../../../../src/types';
import { PostDetail } from '../../../../src/types/post';
import { WorkDetail } from '../../../../src/types/work';
import SimpleLayout from '../../../../src/components/layouts/SimpleLayout';
import WorkDetailComponent from '../../../../src/components/work/WorkDetail';
import { search as searchPost, isFavoritedByUser, isLikedByUser } from '../../../../src/facades/post';
import { countCycles, countPosts, find as findWork } from '../../../../src/facades/work';

interface Props {
  post: PostDetail;
  work: WorkDetail;
  cyclesCount: number;
  postsCount: number;
  mySocialInfo: MySocialInfo;
}

const PostDetailInWorkPage: NextPage<Props> = ({ post, work, cyclesCount, postsCount, mySocialInfo }) => {
  return (
    <SimpleLayout title={`${post.title} · ${work.title}`}>
      <WorkDetailComponent
        work={work}
        post={post}
        cyclesCount={cyclesCount}
        postsCount={postsCount}
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
      favs: true,
      likes: true,
    }),
  })) as PostDetail[];
  if (postResults.length === 0) {
    return { notFound: true };
  }

  const cyclesCount = await countCycles(work);
  const postsCount = await countPosts(work);

  const session = (await getSession({ req })) as Session;
  const mySocialInfo: MySocialInfo = {
    favoritedByMe: undefined,
    likedByMe: undefined,
  };
  if (session != null) {
    mySocialInfo.favoritedByMe = !!(await isFavoritedByUser(postResults[0], session.user));
    mySocialInfo.likedByMe = !!(await isLikedByUser(postResults[0], session.user));
  }

  return {
    props: {
      work,
      post: postResults[0],
      cyclesCount: cyclesCount.count,
      postsCount: postsCount.count,
      mySocialInfo,
    },
  };
};

export default PostDetailInWorkPage;
