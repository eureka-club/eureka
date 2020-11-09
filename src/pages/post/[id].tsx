import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';
import { Col, Row } from 'react-bootstrap';

import DetailLayout from '../../components/layouts/DetailLayout';
import PostDetail from '../../components/PostDetail';
import { MosaicItem, PostObject } from '../../types';
import { mosaicItems } from '../index';

interface Props {
  post: PostObject;
}

const PostDetailPage: FunctionComponent<Props> = ({ post }) => {
  return (
    <DetailLayout title={post.title}>
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
  if (id == null) {
    return { notFound: true }; // err 404
  }

  const post = mosaicItems.find((item: MosaicItem): boolean => item.kind === 'post' && item.id === id);
  if (post == null) {
    return { notFound: true };
  }

  return {
    props: { post },
  };
};

export default PostDetailPage;
