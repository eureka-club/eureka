import dayjs from 'dayjs';
import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';

import DetailLayout from '../../components/layouts/DetailLayout';
import PostDetailComponent from '../../components/PostDetail';
import { PostDetail, PostFullDetail } from '../../types';
import { fetchFullPostDetail, findRelatedPosts } from '../../repositories/Post';
import Mosaic from '../../components/Mosaic';

interface Props {
  post: PostFullDetail;
  relatedPosts: PostDetail[];
}

const PostDetailPage: FunctionComponent<Props> = ({ post, relatedPosts }) => {
  return (
    <DetailLayout title={post['work.title']}>
      <PostDetailComponent post={post} />
      <Mosaic stock={relatedPosts} />
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

  const relatedPosts = await findRelatedPosts(post);
  const serializablePosts = relatedPosts.map((relatedPost) => {
    if (relatedPost['cycle.id'] != null) {
      return {
        ...relatedPost,
        ...{
          'cycle.start_date': dayjs(relatedPost['cycle.start_date']).format('YYYY-MM-DD'),
          'cycle.end_date': dayjs(relatedPost['cycle.end_date']).format('YYYY-MM-DD'),
        },
      };
    }

    return relatedPost;
  });

  return {
    props: {
      post,
      relatedPosts: serializablePosts,
    },
  };
};

export default PostDetailPage;
