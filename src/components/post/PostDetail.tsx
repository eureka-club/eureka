import { Work } from '@prisma/client';
import classNames from 'classnames';
import dayjs from 'dayjs';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent } from 'react';
import Col from 'react-bootstrap/Col';
import ActionButton from '../common/ActionButton';
import { CycleDetail } from '../../types/cycle';

import { DATE_FORMAT_SHORT } from '../../constants';
import { PostDetail as PostDetailType } from '../../types/post';
import HyvorComments from '../common/HyvorComments';
import LocalImageComponent from '../LocalImage';
import UnclampText from '../UnclampText';
import styles from './PostDetail.module.css';

interface Props {
  post: PostDetailType;
  work?: Work;
  cycle?: CycleDetail;
  currentActionsPost: { [key: string]: boolean };
}

const PostDetail: FunctionComponent<Props> = ({ post, work, currentActionsPost, cycle }) => {
  const { t } = useTranslation('postDetail');
  const hyvorId = `post-${post.id}`;

  return (
    <>
      <Col md={{ span: 4 }}>
        <div className={classNames(styles.imgWrapper, 'mb-3')}>
          <LocalImageComponent filePath={post.localImages[0].storedFile} alt={post.title} />
        </div>
        <ActionButton
          level={post}
          levelName="post"
          currentActions={currentActionsPost}
          showCounts
          parent={cycle || work || null}
        />
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
            <small className={styles.postDate}>{dayjs(post.createdAt).format(DATE_FORMAT_SHORT)}</small>
          </div>
          <h1>{post.title}</h1>
          {post.contentText != null && <UnclampText text={post.contentText} clampHeight="20rem" />}
        </div>
        <HyvorComments id={hyvorId} />
      </Col>
    </>
  );
};

export default PostDetail;
