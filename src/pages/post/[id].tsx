import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';

import DetailLayout from '../../components/layouts/DetailLayout';
import PostDetail from '../../components/PostDetail';
import { PostFullDetail } from '../../models/Post';
import { fetchFullPostDetail } from '../../repositories/Post';

interface Props {
  post: PostFullDetail;
}

const PostDetailPage: FunctionComponent<Props> = ({ post }) => {
  return (
    <DetailLayout title={post['work.title']}>
      <PostDetail post={post} />
    </DetailLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { id } = params!;
  if (id == null || typeof id !== 'string') {
    return { notFound: true }; // err 404
  }

  const post = await fetchFullPostDetail(id);
  if (post == null) {
    return { notFound: true };
  }

  return {
    props: {
      post,
    },
  };
};

export default PostDetailPage;
