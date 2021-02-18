import { GetServerSideProps, NextPage } from 'next';

import { CycleDetail } from '../../../../src/types/cycle';
import { PostDetail } from '../../../../src/types/post';
import PopupLayout from '../../../../src/components/layouts/PopupLayout';
import CycleDetailComponent from '../../../../src/components/cycle/CycleDetail';
import { countPosts, countWorks, find as findCycle } from '../../../../src/facades/cycle';
import { search as searchPost } from '../../../../src/facades/post';

interface Props {
  cycle: CycleDetail;
  post: PostDetail;
  postsCount: number;
  worksCount: number;
}

const PostDetailInCyclePage: NextPage<Props> = ({ cycle, post, postsCount, worksCount }) => {
  return (
    <PopupLayout title={`${post.title} · ${cycle.title}`}>
      <CycleDetailComponent cycle={cycle} post={post} postsCount={postsCount} worksCount={worksCount} />
    </PopupLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
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
    }),
  })) as PostDetail[];
  if (postResults.length === 0) {
    return { notFound: true };
  }

  const postsCount = await countPosts(cycle);
  const worksCount = await countWorks(cycle);

  return {
    props: {
      cycle,
      post: postResults[0],
      postsCount: postsCount.count,
      worksCount: worksCount.count,
    },
  };
};

export default PostDetailInCyclePage;
