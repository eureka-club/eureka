import classNames from 'classnames';
import { FunctionComponent } from 'react';
import { Col, Row } from 'react-bootstrap';

import { FullPostDetail, isFullPostDetail, PostDbObject } from '../models/Post';
import styles from './PostDetail.module.css';
import LocalImage from './LocalImage';

interface Props {
  post: PostDbObject | FullPostDetail;
}

const PostDetail: FunctionComponent<Props> = ({ post }) => {
  const contentTextTokens = post['post.content_text'].split('\n').filter((token: string) => token !== '');

  return (
    <>
      <Row>
        <Col>
          <div className="mb-4">
            <h1>{post['work.title']}</h1>
            <span className={styles.titleWorkAuthor}>{post['work.author']}</span>
            <div>
              {isFullPostDetail(post) ? (
                <LocalImage
                  filePath={post['creator.avatar.file']}
                  alt="creator avatar"
                  className={classNames(styles.creatorAvatar, 'mr-3')}
                />
              ) : (
                <span className={classNames(styles.creatorAvatar, 'mr-3')} />
              )}
              <span>{post['creator.user_name']}</span>
              <a href={post['work.link']} className={classNames(styles.workLink, 'ml-4')}>
                Link to content
              </a>
            </div>
          </div>

          <div className={classNames(styles.contentText, 'mb-4')}>
            {contentTextTokens.map((token) => (
              <p key={`${token[0]}${token[1]}-${token.length}`}>{token}</p>
            ))}
          </div>
          <div className={classNames(styles.commentsPlaceholder, 'd-flex', 'mb-5')}>comments section</div>
        </Col>

        <Col md={{ span: 5 }}>
          <div className={classNames(styles.imgWrapper, 'mb-3')}>
            <LocalImage filePath={post['local_image.stored_file']} alt={post['work.title']} />
          </div>
          <div className={classNames(styles.workInitials, 'pl-2 mb-4')}>
            <p>{post['work.title']}</p>
            <p>{post['work.author']}</p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2>Related Posts and Cycles</h2>
        </Col>
      </Row>
    </>
  );
};

export default PostDetail;
