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
import MosaicItem from './MosaicItem';
import { MosaicContext } from '../../useMosaicContext';

import CommentsList from '../common/CommentsList';
import LocalImageComponent from '../LocalImage';
import SocialInteraction from '../common/SocialInteraction';
import UnclampText from '../UnclampText';
import styles from './PostDetail.module.css';
import Avatar from '../common/UserAvatar';
import { useCycleContext } from '../../useCycleContext';
import usePost from '@/src/usePost'
import {useQueryClient} from 'react-query'
interface Props {
  postId: number;
  // cycle?: CycleMosaicItem;
  work?: WorkMosaicItem;
  // mySocialInfo?: MySocialInfo;
  cacheKey:[string,string];
}

dayjs.extend(utc);
dayjs.extend(timezone);

const PostDetail: FunctionComponent<Props> = ({ postId, work,cacheKey }) => {
  const { t } = useTranslation('createPostForm');
  const router = useRouter();
  const queryClient = useQueryClient()
  const cycleContext = useCycleContext();
  const [cycle, setCycle] = useState<CycleMosaicItem | null>();
  const [currentUserIsParticipant, setCurrentUserIsParticipant] = useState<boolean>(false);
  useEffect(() => {
    if (cycleContext) {
      if (cycleContext.cycle) {
        if (!cycleContext.currentUserIsParticipant && cycleContext.cycle.access !== 1)
          router.push(`/cycle/${cycleContext.cycle.id}/1`);
        setCycle(cycleContext.cycle);
        setCurrentUserIsParticipant(cycleContext.currentUserIsParticipant || false);
      }
    }
  }, [cycleContext, router]);

  const {data:post} = usePost(+postId,{
    enabled:!!postId
  })

  if(!post)return <></>


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
    <article data-cy="post-detail">
      {/* {work ||
        (cycle && ( */}
     <MosaicContext.Provider value={{ showShare: true }}>
      <div  className={classNames('d-flex d-md-none flex-row justify-content-between mt-3', styles.postInfo)}>

             <div>
                    <Link href={`/mediatheque/${post.creator.id}`} passHref>
                      {/* <a>
                        <img
                          src={post.creator.image || '/img/default-avatar.png'}
                          alt="creator avatar"
                          className={styles.creatorAvatar}
                        />
                        {post.creator.name}
                      </a> */}
                      <Avatar userId={post.creator.id} showFullName />
                    </Link>
               </div>
               <div>
                    <small className={styles.postDate}>
                      {
                        dayjs(post.createdAt).tz(dayjs.tz.guess()).format(DATE_FORMAT_SHORT)
                        // dayjs(post.createdAt).format(DATE_FORMAT_SHORT)
                      }
                    </small>
                 </div>
            </div>
           
            <h1 className="text-secondary fw-bold mb-2 d-sm-block d-md-none"> {post.title} </h1> {/*titulo y abajo texto eureka*/}
           <div className='d-flex d-md-none flex-row flex-wrap'>
                {work != null && (
                <aside className='me-3' >
                  <Badge bg="orange" className="rounded-pill fw-light text-black tagText">
                    {t(`common:${work.type}`)}
                  </Badge>
                  <section className="my-1">
                    <h6 className="mb-0">
                      <Link href={`/work/${work.id}`} passHref>
                        <p className="text-break mb-0 tagText">
                          <a className="cursor-pointer">{work.title}</a>,{' '}
                          <span className={styles.workInfoAuthor}>{work.author}</span>
                        </p>
                      </Link>
                    </h6>
                  </section>
                </aside>
              )}
              {post.cycles && post.cycles.length > 0 && (
                <aside className=''>
                  <Badge bg="primary" className="rounded-pill fw-light text-dark tagText">
                    {t('common:cycle')}
                  </Badge>
                  <section className="my-1">
                    <h6>
                      <Link href={`/cycle/${post.cycles[0].id}/1`} passHref>
                        <p className="text-break mb-0 tagText">
                          <a className="cursor-pointer">{post.cycles[0].title}</a>
                        </p>
                      </Link>
                    </h6>
                  </section>
                </aside>
              )}
            </div>

     
      <Row className="mb-5 d-flex flex-column flex-md-row">
        <Col className='col-md-5 col-lg-4 col-xl-3'>
          {/* {canEditPost() && (
            <Button variant="warning" onClick={handleEditClick} size="sm">
              {t('edit')}
            </Button>
          )} */}
          <div className='mb-2 d-none d-md-block'>
            <MosaicItem cacheKey={cacheKey} className='' postId={post.id} showdetail={false}/>
          </div>
          <div className='container d-sm-block d-md-none mb-2 mt-2 position-relative'>
             <MosaicItem cacheKey={cacheKey} className='postition-absolute start-50 translate-middle-x' postId={post.id} showdetail={false}/>
          </div>
         </Col>
        <Col className='col-md-7 col-lg-8 col-xl-9'>
          <div className="px-4">
            <div className={classNames('d-none d-md-flex flex-row justify-content-between', styles.postInfo)}>
              <div>
              <Link href={`/mediatheque/${post.creator.id}`} passHref>
                {/* <a>
                  <img
                    src={post.creator.image || '/img/default-avatar.png'}
                    alt="creator avatar"
                    className={styles.creatorAvatar}
                  />
                  {post.creator.name}
                </a> */}
                <Avatar userId={post.creator.id} showFullName />
              </Link>
              </div>
              <div>
              <small className={styles.postDate}>
                {
                  dayjs(post.createdAt).tz(dayjs.tz.guess()).format(DATE_FORMAT_SHORT)
                  // dayjs(post.createdAt).format(DATE_FORMAT_SHORT)
                }
              </small>
              </div>
            </div>
            <h1 className="text-secondary fw-bold mb-2  d-none d-md-block"> {post.title} </h1> {/*titulo y abajo texto eureka*/}
           <div className='d-none d-md-flex flex-row flex-wrap'>
                {work != null && (
                <aside className="me-3">
                  <Badge bg="orange" className="rounded-pill py-1 px-2 fw-light text-black tagText">
                    {t(`common:${work.type}`)}
                  </Badge>
                  <section className="my-1">
                    <h6 className="mb-0">
                      <Link href={`/work/${work.id}`} passHref>
                        <p className="text-break mb-0 tagText">
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
                  <Badge bg="primary" className="rounded-pill py-1 px-2 fw-light text-dark tagText">
                    {t('common:cycle')}
                  </Badge>
                  <section className="my-1">
                    <h6>
                      <Link href={`/cycle/${post.cycles[0].id}/1`} passHref>
                        <p className="text-break mb-0 tagText">
                          <a className="cursor-pointer">{post.cycles[0].title}</a>
                        </p>
                      </Link>
                    </h6>
                  </section>
                </aside>
              )}
            </div>
            <div className='mt-3'>
            {post.contentText != null && <UnclampText text={post.contentText} clampHeight="8rem" />}
            </div>
          </div>
          <div className='container d-none d-lg-block'>
            <CommentsList entity={post} parent={cycle! || work!} cacheKey={['POST', `${post.id}`]} />
          </div>
        </Col>
        <div className='container d-sm-block d-lg-none mt-3'>
            <CommentsList entity={post} parent={cycle! || work!} cacheKey={['POST', `${post.id}`]} />
          </div>
      </Row>
     </MosaicContext.Provider>

      {/* )) || <Alert variant="warning">Not found</Alert>} */}
    </article>
  );
};

export default PostDetail;
