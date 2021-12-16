import classNames from 'classnames';
// import { useAtom } from 'jotai';
// import { useSession } from 'next-auth/client';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, useEffect, useState } from 'react';
import { Row, Col, Badge } from 'react-bootstrap';

import { useRouter } from 'next/router';
import { DATE_FORMAT_SHORT } from '../../constants';
// import { Session } from '../../types';
import { CycleMosaicItem } from '../../types/cycle';
import { PostMosaicItem } from '../../types/post';
// import globalModalsAtom from '../../atoms/globalModals';
import { WorkMosaicItem } from '../../types/work';

import CommentsList from '../common/CommentsList';
import LocalImageComponent from '../LocalImage';
import SocialInteraction from '../common/SocialInteraction';
import UnclampText from '../UnclampText';
import styles from './PostDetail.module.css';
import Avatar from '../common/UserAvatar';
import { useCycleContext } from '../../useCycleContext';

interface Props {
  post: PostMosaicItem;
  // cycle?: CycleMosaicItem;
  work?: WorkMosaicItem;
  // mySocialInfo?: MySocialInfo;
}

dayjs.extend(utc);
dayjs.extend(timezone);

const PostDetail: FunctionComponent<Props> = ({ post, work }) => {
  const router = useRouter();
  const cycleContext = useCycleContext();
  const [cycle, setCycle] = useState<CycleMosaicItem | null>();
  const [currentUserIsParticipant, setCurrentUserIsParticipant] = useState<boolean>(false);
  useEffect(() => {
    if (cycleContext) {
      if (cycleContext.cycle) {
        if (!cycleContext.currentUserIsParticipant && cycleContext.cycle.access !== 1)
          router.push(`/cycle/${cycleContext.cycle.id}`);
        setCycle(cycleContext.cycle);
        setCurrentUserIsParticipant(cycleContext.currentUserIsParticipant || false);
      }
    }
  }, [cycleContext, router]);
  const { t } = useTranslation('createPostForm');

  // const [session] = useSession() as [Session | null | undefined, boolean];
  // const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);

  // const handleEditClick = (ev: MouseEvent<HTMLButtonElement>) => {
  //   ev.preventDefault();
  //   setGlobalModalsState({ ...globalModalsState, ...{ editPostModalOpened: true } });
  // };
  // const canEditPost = (): boolean => {
  //   if (session && session.user.id === post.creatorId) return true;
  //   return false;
  // };

  if (cycle && cycle.access !== 1 && !currentUserIsParticipant) return null;

  return (
    <>
      {/* {work ||
        (cycle && ( */}
      <Row className="mb-5">
        <Col md={{ span: 4 }}>
          {/* {canEditPost() && (
            <Button variant="warning" onClick={handleEditClick} size="sm">
              {t('edit')}
            </Button>
          )} */}
          <div className={classNames(styles.imgWrapper, 'mb-2')}>
            <LocalImageComponent filePath={post.localImages[0].storedFile} alt={post.title} />
          </div>
          <SocialInteraction entity={post} parent={cycle || work || null} showRating={false} showButtonLabels={false} />
          {work != null && (
            <aside className="">
              <Badge bg="orange" className="rounded-pill py-1 px-2 mt-3 text-black fs-6">
                {t(`common:${work.type}`)}
              </Badge>
              <section className="my-1">
                <h6 className="mb-0">
                  <Link href={`/work/${work.id}`} passHref>
                    <p className="text-break mb-0">
                      <a className="cursor-pointer">{work.title}</a>,{' '}
                      <span className={styles.workInfoAuthor}>{work.author}</span>
                    </p>
                  </Link>
                </h6>
              </section>
            </aside>
          )}
          {post.cycles && post.cycles.length > 0 && (
            <aside className="">
              <Badge bg="primary" className="rounded-pill py-1 px-2 mt-3 text-dark fs-6">
                {t('common:cycle')}
              </Badge>
              <section className="my-1">
                <h6>
                  <Link href={`/cycle/${post.cycles[0].id}`} passHref>
                    <p className="text-break mb-0">
                      <a className="cursor-pointer">{post.cycles[0].title}</a>
                    </p>
                  </Link>
                </h6>
              </section>
            </aside>
          )}
        </Col>
        <Col md={{ span: 8 }}>
          <div className="px-4">
            <div className={classNames('d-flex', styles.postInfo)}>
              <Link href={`/mediatheque/${post.creator.id}`} passHref>
                {/* <a>
                  <img
                    src={post.creator.image || '/img/default-avatar.png'}
                    alt="creator avatar"
                    className={styles.creatorAvatar}
                  />
                  {post.creator.name}
                </a> */}
                <Avatar user={post.creator} showFullName />
              </Link>
              <small className={styles.postDate}>
                {
                  dayjs(post.createdAt).tz(dayjs.tz.guess()).format(DATE_FORMAT_SHORT)
                  // dayjs(post.createdAt).format(DATE_FORMAT_SHORT)
                }
              </small>
            </div>
            <h1 className="text-secondary fw-bold mb-3"> {post.title} </h1>
            {post.contentText != null && <UnclampText text={post.contentText} clampHeight="8rem" />}
          </div>
          <CommentsList entity={post} parent={cycle || work} cacheKey={['POST', `${post.id}`]} />
        </Col>
      </Row>
      {/* )) || <Alert variant="warning">Not found</Alert>} */}
    </>
  );
};

export default PostDetail;
