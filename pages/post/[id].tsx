import dayjs from 'dayjs';
import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';

import { DATE_FORMAT_PROPS } from '../../src/constants';
import DetailLayout from '../../src/components/layouts/DetailLayout';
import PostDetailComponent from '../../src/components/PostDetail';
import { PostDetail } from '../../src/types';
import { fetchFullPostDetail, findRelatedPosts } from '../../src/repositories/Post';
import Mosaic from '../../src/components/Mosaic';

interface Props {
  post: PostDetail;
  relatedPosts: PostDetail[];
}

const PostDetailPage: FunctionComponent<Props> = ({ post, relatedPosts }) => {
  return (
    <DetailLayout title={post['work.title']}>
      <PostDetailComponent post={post} />
      <Mosaic stack={relatedPosts} />
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
          'cycle.start_date': dayjs(relatedPost['cycle.start_date']).format(DATE_FORMAT_PROPS),
          'cycle.end_date': dayjs(relatedPost['cycle.end_date']).format(DATE_FORMAT_PROPS),
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
