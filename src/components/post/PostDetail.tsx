import { Work } from '@prisma/client';
import classNames from 'classnames';
import { DiscussionEmbed } from 'disqus-react';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { FunctionComponent } from 'react';
import Col from 'react-bootstrap/Col';
import ActionButton from '../common/ActionButton';
import { FiShare2 } from 'react-icons/fi';

import { DATE_FORMAT_HUMANIC_ADVANCED, DISQUS_SHORTNAME, WEBAPP_URL } from '../../constants';
import { PostDetail as PostDetailType } from '../../types/post';
import LocalImageComponent from '../LocalImage';
import UnclampText from '../UnclampText';
import { advancedDayjs } from '../../lib/utils';
import styles from './PostDetail.module.css';

interface Props {
  post: PostDetailType;
  work?: Work;
  currentActions: object;
  currentActionsPost: object;
}

const PostDetail: FunctionComponent<Props> = ({
  post,
  work,
  currentActions,
  currentActionsPost,
}) => {
  const { asPath } = useRouter();
  const { t } = useTranslation('postDetail');
  const disqusConfig = {
    identifier: asPath,
    title: post.title,
    url: `${WEBAPP_URL}${asPath}`,
  };

  return (
    <>
      <Col md={{ span: 4 }}>
        <div className={classNames(styles.imgWrapper, 'mb-3')}>
          <LocalImageComponent
            filePath={post.localImages[0].storedFile}
            alt={post.title}
          />
        </div>
        <section className={styles.socialInfo}>
          <ActionButton 
            level={post}
            level_name="post"
            action="fav"
            currentActions={currentActionsPost}
            show_counts
          />
          <ActionButton 
            level={post}
            level_name="post"
            action="like"
            currentActions={currentActionsPost}
            show_counts
          />
          <span>
            <FiShare2 /> #
          </span>
        </section>

        <table className={styles.parentContent}>
          <tbody>
            {work != null && (
              <tr>
                <td className={styles.parentBadges}>
                  <Link href={`/work/${work.id}`}>
                    <a className={styles.workInfoType}>{t(`common:${work.type}`)}</a>
                  </Link>
                </td>
                <td className="pb-2">
                  <h4 className={styles.workInfoTitle}>{work.title}</h4>
                  <h5 className={styles.workInfoAuthor}>{work.author}</h5>
                </td>
              </tr>
            )}
            {post.cycles.length > 0 && (
              <tr>
                <td className={styles.parentBadges}>
                  <Link href={`/cycle/${post.cycles[0].id}`}>
                    <a className={styles.cycleInfoType}>{t('common:cycle')}</a>
                  </Link>
                </td>
                <td>
                  <h4 className={styles.workInfoTitle}>{post.cycles[0].title}</h4>
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
