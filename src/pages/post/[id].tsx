import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';
import { Col, Row } from 'react-bootstrap';

import DetailLayout from '../../components/layouts/DetailLayout';
import PostDetail from '../../components/PostDetail';
import { TABLE_NAME as LOCAL_IMAGE_TABLE_NAME } from '../../models/LocalImage';
import { PostDbObject } from '../../models/Post';
import { TABLE_NAME as USER_TABLE_NAME } from '../../models/User';
import { TABLE_NAME as WORK_TABLE_NAME } from '../../models/Work';
import { find } from '../../repositories/Post';

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

  const post = await find(id, [{ table: USER_TABLE_NAME, alias: 'creator' }, LOCAL_IMAGE_TABLE_NAME, WORK_TABLE_NAME]);
  if (post == null) {
    return { notFound: true };
  }

  return {
    props: { post },
  };
};

export default PostDetailPage;
