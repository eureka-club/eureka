import classNames from 'classnames';
import { useAtom } from 'jotai';
import { useSession } from 'next-auth/client';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, MouseEvent } from 'react';
import { Row, Col, Button } from 'react-bootstrap';

import { DATE_FORMAT_SHORT } from '../../constants';
import { MySocialInfo, Session } from '../../types';
import { CycleDetail } from '../../types/cycle';
import { PostDetail as PostDetailType } from '../../types/post';
import globalModalsAtom from '../../atoms/globalModals';
import { WorkDetail } from '../../types/work';
import HyvorComments from '../common/HyvorComments';
import LocalImageComponent from '../LocalImage';
import SocialInteraction from '../common/SocialInteraction';
import UnclampText from '../UnclampText';
import styles from './PostDetail.module.css';

interface Props {
  post: PostDetailType;
  cycle?: CycleDetail;
  work?: WorkDetail;
  mySocialInfo: MySocialInfo;
}

dayjs.extend(utc);
dayjs.extend(timezone);

const PostDetail: FunctionComponent<Props> = ({ post, cycle, work }) => {
  const currentWork = work;
  const { t } = useTranslation('createPostForm');
  const hyvorId = `post-${post.id}`;
  const [session] = useSession() as [Session | null | undefined, boolean];
  const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);

  const handleEditClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    setGlobalModalsState({ ...globalModalsState, ...{ editPostModalOpened: true } });
  };
  const canEditPost = (): boolean => {
    if (session && session.user.id === post.creatorId) return true;
    return false;
  };
  return (
    <>
      <Row className="mb-5">
        <Col md={{ span: 4 }}>
          {canEditPost() && (
            <Button variant="warning" onClick={handleEditClick} size="sm">
              {t('edit')}
            </Button>
          )}
          <div className={classNames(styles.imgWrapper, 'mb-3')}>
            <LocalImageComponent filePath={post.localImages[0].storedFile} alt={post.title} />
          </div>
          <SocialInteraction entity={post} parent={cycle || work || null} showCounts />
          <table className={styles.parentContent}>
            <tbody>
              {currentWork != null && (
                <tr>
                  <td className={styles.parentBadges}>
                    <Link href={`/work/${currentWork.id}`}>
                      <a className={styles.workInfoType}>{t(`common:${currentWork.type}`)}</a>
                    </Link>
                  </td>
                  <td className="pb-2">
                    <h4 className={styles.workInfoTitle}>{currentWork.title}</h4>
                    <h5 className={styles.workInfoAuthor}>{currentWork.author}</h5>
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
              <Link href={`/mediatheque/${post.creator.id}`}>
                <a>
                  <img
                    src={post.creator.image || '/img/default-avatar.png'}
                    alt="creator avatar"
                    className={styles.creatorAvatar}
                  />
                  {post.creator.name}
                </a>
              </Link>
              <small className={styles.postDate}>
                {
                  dayjs(post.createdAt).tz(dayjs.tz.guess()).format(DATE_FORMAT_SHORT)
                  // dayjs(post.createdAt).format(DATE_FORMAT_SHORT)
                }
              </small>
            </div>
            <h1>{post.title}</h1>
            {post.contentText != null && <UnclampText text={post.contentText} clampHeight="20rem" />}
          </div>
          <HyvorComments id={hyvorId} />
        </Col>
      </Row>
    </>
  );
};

export default PostDetail;
