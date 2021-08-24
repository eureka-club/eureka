import { Cycle, User, Work } from '@prisma/client';
import classNames from 'classnames';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import SocialInteraction from '../common/SocialInteraction';

import { PostMosaicItem } from '../../types/post';
import LocalImageComponent from '../LocalImage';
import styles from './MosaicItem.module.css';
import { isCycle, isWork } from '../../types';
import { CycleMosaicItem } from '../../types/cycle';
import { WorkMosaicItem } from '../../types/work';

import Avatar from '../common/UserAvatar';

interface Props {
  post: PostMosaicItem;
  postParent?: Cycle | Work;
  display?: 'vertically' | 'horizontally';
}

const MosaicItem: FunctionComponent<Props> = ({ post, postParent, display }) => {
  const postLinkHref = ((): string | null => {
    if (postParent == null) {
      return `/post/${post.id}`;
    }
    if (isCycle(postParent)) {
      return `/cycle/${postParent.id}/post/${post.id}`;
    }
    if (isWork(postParent)) {
      return `/work/${postParent.id}/post/${post.id}`;
    }

    return null;
  })();
  const [creator] = useState(post.creator as User);

  const { t } = useTranslation('common');
  if (display === 'horizontally')
    return (
      <Container className={`${styles.post} ${styles.postHorizontally}`}>
        <Row style={{ paddingTop: '1em' }}>
          <Col>
            {postParent && (
              <h3 className={styles.title}>
                {postLinkHref != null ? (
                  <Link href={postLinkHref}>
                    <a>{postParent.title}</a>
                  </Link>
                ) : (
                  postParent.title
                )}
              </h3>
            )}
          </Col>
          <Col>
            <div style={{ textAlign: 'right' }}>
              <span className={styles.type}>{t('post')}</span>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={5} xs={5} className={styles.imageContainerHorizontally}>
            {postLinkHref != null ? (
              <Link href={postLinkHref}>
                <a>
                  <LocalImageComponent
                    className={styles.postImage}
                    filePath={post.localImages[0]?.storedFile}
                    alt={post.title}
                  />
                  {/* <div className={styles.gradient} /> */}
                </a>
              </Link>
            ) : (
              <>
                <LocalImageComponent
                  className={styles.postImage}
                  filePath={post.localImages[0]?.storedFile}
                  alt={post.title}
                />
                {/* <div className={styles.gradient} /> */}
              </>
            )}
            <div className={styles.postDetail}>
              {postParent && (
                <>
                  {creator && <Avatar user={creator} size="xs" />}
                  {` `}
                  {new Date(post.createdAt).toLocaleDateString()}
                </>
              )}
            </div>
            <SocialInteraction
              entity={post as PostMosaicItem}
              parent={postParent}
              showRating={false}
              showButtonLabels={false}
            />
          </Col>
          <Col md={7} xs={7}>
            <Row>
              <Col md={12}>
                <h5 className={styles.work}>{post.title}</h5>
              </Col>
              <Col md={12} className="d-none d-lg-block">
                <p>{post.contentText}</p>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    );

  return (
    <article className={styles.post}>
      <div className={styles.imageContainer}>
        <div className={styles.cycleCreator}>
          <img
            src={post.creator.image || '/img/default-avatar.png'}
            alt="creator avatar"
            className={classNames(styles.cycleCreatorAvatar, 'mr-2')}
          />
          {post.creator.name}
        </div>
        {postLinkHref != null ? (
          <Link href={postLinkHref}>
            <a>
              <LocalImageComponent
                className={styles.postImage}
                filePath={post.localImages[0]?.storedFile}
                alt={post.title}
              />
              <div className={styles.gradient} />
            </a>
          </Link>
        ) : (
          <>
            <LocalImageComponent
              className={styles.postImage}
              filePath={post.localImages[0]?.storedFile}
              alt={post.title}
            />
            <div className={styles.gradient} />
          </>
        )}

        <span className={styles.type}>{t('post')}</span>
      </div>
      <h3 className={styles.title}>
        {postLinkHref != null ? (
          <Link href={postLinkHref}>
            <a>{post.title}</a>
          </Link>
        ) : (
          post.title
        )}
      </h3>
      <h5 className={styles.work}>{post.works[0]?.title}</h5>
    </article>
  );
};

export default MosaicItem;
