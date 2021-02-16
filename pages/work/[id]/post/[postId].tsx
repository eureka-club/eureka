import { GetServerSideProps, NextPage } from 'next';

import { PostDetail } from '../../../../src/types/post';
import { WorkWithImages } from '../../../../src/types/work';
import SimpleLayout from '../../../../src/components/layouts/SimpleLayout';
import WorkDetail from '../../../../src/components/work/WorkDetail';
import { search as searchPost } from '../../../../src/facades/post';
import { countCycles, countPosts, find as findWork } from '../../../../src/facades/work';

interface Props {
  post: PostDetail;
  work: WorkWithImages;
  cyclesCount: number;
  postsCount: number;
}

const PostDetailInWorkPage: NextPage<Props> = ({ post, work, cyclesCount, postsCount }) => {
  return (
    <SimpleLayout title={`${post.title} · ${work.title}`}>
      <WorkDetail work={work} post={post} cyclesCount={cyclesCount} postsCount={postsCount} />
    </SimpleLayout>
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
    }),
  })) as PostDetail[];
  if (postResults.length === 0) {
    return { notFound: true };
  }

  const cyclesCount = await countCycles(work);
  const postsCount = await countPosts(work);

  return {
    props: {
      work,
      post: postResults[0],
      cyclesCount: cyclesCount.count,
      postsCount: postsCount.count,
    },
  };
};

export default PostDetailInWorkPage;
