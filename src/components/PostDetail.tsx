import { FunctionComponent } from 'react';
import { Col, Row } from 'react-bootstrap';

import { ASSETS_BASE_URL } from '../constants';
import { PostDbObject } from '../models/Post';
import styles from './PostDetail.module.css';

interface Props {
  post: PostDbObject;
}

const PostDetail: FunctionComponent<Props> = ({ post }) => {
  const contentTextTokens = post['post.content_text'].split('\n').filter((token: string) => token !== '');

  return (
    <Row>
      <Col>
        <div className="mb-4">
          <h1>{post['work.title']}</h1>
          <span>{post['work.author']}</span>
        </div>

        <div className="contentText">
          {contentTextTokens.map((token) => (
            <p key={`${token[0]}${token[1]}-${token.length}`}>{token}</p>
          ))}
        </div>
      </Col>

      <Col md={{ span: 5 }}>
        <div className={styles.imgWrapper}>
          <img src={`${ASSETS_BASE_URL}/${post['local_image.stored_file']}`} alt={post['work.title']} />
        </div>
      </Col>
    </Row>
  );
};

export default PostDetail;
