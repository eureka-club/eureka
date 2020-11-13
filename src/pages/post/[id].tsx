import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';
import { Col, Row } from 'react-bootstrap';

import DetailLayout from '../../components/layouts/DetailLayout';
import PostDetail from '../../components/PostDetail';
import { PostDbObject } from '../../models/Post';
import { fetchFullPostDetail } from '../../repositories/Post';

interface Props {
  post: PostDbObject;
}

const PostDetailPage: FunctionComponent<Props> = ({ post }) => {
  return (
    <DetailLayout title={post['work.title']}>
      <Row>
        <Col md={{ offset: 1, span: 11 }}>
          <PostDetail post={post} />
        </Col>
      </Row>
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
