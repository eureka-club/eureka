import { Work } from '@prisma/client';
import classNames from 'classnames';
import { DiscussionEmbed } from 'disqus-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FunctionComponent } from 'react';
import Col from 'react-bootstrap/Col';

import { DATE_FORMAT_HUMANIC_ADVANCED, DISQUS_SHORTNAME, WEBAPP_URL } from '../../constants';
import { PostDetail as PostDetailType } from '../../types/post';
import LocalImageComponent from '../LocalImage';
import UnclampText from '../UnclampText';
import { advancedDayjs } from '../../lib/utils';
import styles from './PostDetail.module.css';

interface Props {
  post: PostDetailType;
  work?: Work;
}

const PostDetail: FunctionComponent<Props> = ({ post, work }) => {
  const { asPath } = useRouter();
  const disqusConfig = {
    identifier: asPath,
    title: post.title,
    url: `${WEBAPP_URL}${asPath}`,
  };

  return (
    <>
      <Col md={{ span: 4 }}>
        <div className={classNames(styles.imgWrapper, 'mb-3')}>
          <LocalImageComponent filePath={post.localImages[0].storedFile} alt={post.title} />
        </div>
        {work != null && (
          <div className="d-flex mb-3">
            <div className="mr-3">
              <Link href={`/work/${work.id}`}>
                <a className={styles.workInfoType}>{work.type}</a>
              </Link>
            </div>
            <div className="pt-1">
              <h4 className={styles.workInfoTitle}>{work.title}</h4>
              <h5 className={styles.workInfoAuthor}>{work.author}</h5>
            </div>
          </div>
        )}
        {post.cycles.length > 0 && (
          <div className="d-flex">
            <div className="mr-3">
              <Link href={`/cycle/${post.cycles[0].id}`}>
                <a className={styles.cycleInfoType}>Cycle</a>
              </Link>
            </div>
            <div className="pt-1">
              <h4 className={styles.workInfoTitle}>{post.cycles[0].title}</h4>
            </div>
          </div>
        )}
      </Col>
      <Col md={{ span: 8 }}>
        <div className="pt-3 px-4">
          <div className={classNames('d-flex', styles.postInfo)}>
            <img
              src={post.creator.image || '/img/default-avatar.png'}
              alt="creator avatar"
              className={styles.creatorAvatar}
            />
            {post.creator.name}
            <small className={styles.postDate}>
              {advancedDayjs(post.createdAt).format(DATE_FORMAT_HUMANIC_ADVANCED)}
            </small>
          </div>
          <h1>{post.title}</h1>
          {post.contentText != null && <UnclampText text={post.contentText} clampHeight="20rem" />}
        </div>
        <DiscussionEmbed config={disqusConfig} shortname={DISQUS_SHORTNAME!} />
      </Col>
    </>
  );
};

export default PostDetail;
