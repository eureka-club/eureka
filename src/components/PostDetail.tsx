import classNames from 'classnames';
import { useRouter } from 'next/router';
import { FunctionComponent } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import { DiscussionEmbed } from 'disqus-react';
import { BsBoxArrowUpRight } from 'react-icons/bs';

import { DISQUS_SHORTNAME, WEBAPP_URL } from '../constants';
import { PostFullDetail, PostDetail, isPostFullDetail } from '../types';
import LocalImage from './LocalImage';
import styles from './PostDetail.module.css';

interface Props {
  post: PostDetail | PostFullDetail;
}

const PostDetailComponent: FunctionComponent<Props> = ({ post }) => {
  const { asPath } = useRouter();
  const contentTextTokens =
    post['post.content_text'] != null
      ? post['post.content_text'].split('\n').filter((token: string) => token !== '')
      : [];

  return (
    <>
      <Row>
        <Col md={{ span: 5 }}>
          <section className="mb-4">
            <h1>{post['work.title']}</h1>
            <span className={styles.titleWorkAuthor}>{post['work.author']}</span>
            <div>
              {isPostFullDetail(post) ? (
                <LocalImage
                  filePath={post['creator.avatar.file']}
                  alt="creator avatar"
                  className={classNames(styles.creatorAvatar, 'mr-3')}
                />
              ) : (
                <Spinner animation="grow" variant="info" className={classNames(styles.creatorAvatar, 'mr-3')} />
              )}
              <span>{post['creator.user_name']}</span>
              {post['work.link'] != null && (
                <a
                  href={post['work.link']}
                  className={classNames(styles.workLink, 'ml-4')}
                  target="_blank"
                  rel="noreferrer"
                >
                  Link to content <BsBoxArrowUpRight />
                </a>
              )}
            </div>
          </section>
          <section className="mb-5">
            {contentTextTokens.map((token) => (
              <p key={`${token[0]}${token[1]}-${token.length}`}>{token}</p>
            ))}
          </section>

          {/* language=CSS */}
          <style jsx global>{`
            #disqus_thread {
              width: 100%;
            }
          `}</style>
          <section className="mb-5">
            <DiscussionEmbed
              shortname={DISQUS_SHORTNAME!}
              config={{
                url: `${WEBAPP_URL}${asPath}`,
                identifier: asPath,
                title: post['work.title'],
              }}
            />
          </section>
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
          <h2 className="mb-5">Related Posts and Cycles</h2>
        </Col>
      </Row>
    </>
  );
};

export default PostDetailComponent;
