"use client"

import classNames from 'classnames';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Link from 'next/link';
import { FunctionComponent } from 'react';
import { Row, Col, Badge, Button, ButtonGroup } from 'react-bootstrap';
import { DATE_FORMAT_SHORT } from '@/src/constants/index';
import { WorkMosaicItem } from '@/src/types/work';
import { MosaicContext } from '@/src/hooks/useMosaicContext';
import UnclampText from '@/src/components/UnclampText';
import styles from './Post.module.css';
import Avatar from '@/src/components/common/UserAvatar';
import usePost from '@/src/hooks/usePost'
import HyvorComments from '@/src/components/common/HyvorComments';
import TagsInput from '@/components/forms/controls/TagsInput';
import { useSession } from 'next-auth/react';
import Spinner from '@/components/Spinner';
import useUser from '@/src/hooks/useUser';
import { Alert } from '@mui/material';
import useCycle from '@/src/hooks/useCycle';
import { Session } from '@/src/types';
import { useDictContext } from "@/src/hooks/useDictContext";
import { PostMosaicItem } from "@/src/types/post";
//import { Alert, Badge, Grid } from "@mui/material";
import { FC, MouseEvent } from "react";
import { t } from "@/src/get-dictionary";
import { useEnvContext } from "@/src/hooks/useEnvContext";
import MosaicItem from "@/src/components/post/MosaicItemDetail";
import { BiArrowBack } from 'react-icons/bi';
import { useRouter } from 'next/navigation';
import useCycleParticipants from '@/src/hooks/useCycleParticipants';

dayjs.extend(utc);
dayjs.extend(timezone);

interface Props {
  post: PostMosaicItem;
  session: Session;
}
const Post: FC<Props> = ({ post, session }) => {
  const { dict } = useDictContext();
  //const{DATE_FORMAT_SHORT}=useEnvContext();
  const router = useRouter();

  const cacheKey: [string, string] = ['POST', `${post.id}`];
  const cycle = post.cycles?.length ? post.cycles[0] : null;
  const {data:participants} = useCycleParticipants(cycle?.id!,{enabled:!!cycle});
  const work = post.works?.length ? post.works[0] : null;

  const currentUserIsParticipant = participants?.findIndex(c => c.id == session.user.id);
  const isPublicPost = cycle?.access == 1;

  const canEditPost = (): boolean => {
    if (session && post && session.user.id === post.creatorId) return true;
    return false;
  };

  const handleEditPostClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    if (post) {
      localStorage.setItem('redirect', `/post/${post.id}`);
      router.push(`/post/${post.id}/edit`);
    }
  };



  if (!post)
    return <Alert color='warning'>Not found</Alert>;

  if (cycle && !isPublicPost && !currentUserIsParticipant)
    return <Alert color='warning'>Unauthorized</Alert>;

  return (
    <article data-cy="post-detail">
      <ButtonGroup className="mt-1 mt-md-3 mb-1">
        <Button variant="primary text-white" onClick={() => router.back()} size="sm">
          <BiArrowBack />
        </Button>
        {post && canEditPost() && (
          <>
            <Button variant="warning" onClick={handleEditPostClick} size="sm">
              {t(dict,'edit')}
            </Button>
          </>
        )}
      </ButtonGroup>
      <MosaicContext.Provider value={{ showShare: true }}>
        <div className={classNames('d-flex d-lg-none flex-row justify-content-between mt-3', styles.postInfo)}>
          <div>
            <Link href={`/mediatheque/${post.creator.id}`} passHref>
              <Avatar width={28} height={28} userId={post.creator.id} showFullName />
            </Link>
          </div>
          <div>
            <small className={styles.postDate}>
              {
                dayjs(post.createdAt).tz(dayjs.tz.guess()).format(DATE_FORMAT_SHORT)
              }
            </small>
          </div>
        </div>

        <h1 className="text-secondary fw-bold mb-2 d-sm-block d-lg-none"> {post.title} </h1> {/*titulo y abajo texto eureka*/}
        <div className='d-flex d-lg-none flex-row flex-wrap'>
          {work != null && (
            <aside className='me-3' >
              <Badge bg="orange" className="rounded-pill fw-light text-black tagText">
                {t(dict, `${work.type}`)}
              </Badge>
              <section className="my-1">
                <h2 className="mb-0" style={{ fontSize: '1rem' }}>
                  <Link href={`/work/${work.id}`} passHref>
                    <p className="text-break mb-0 tagText">
                      <a className="cursor-pointer">{work.title}</a>,{' '}
                      <span className={styles.workInfoAuthor}>{work.author}</span>
                    </p>
                  </Link>
                </h2>
              </section>
            </aside>
          )}
          {post.cycles && post.cycles.length > 0 && (
            <aside className=''>
              <Badge bg="primary" className="rounded-pill fw-light text-dark tagText">
                {t(dict, 'cycle')}
              </Badge>
              <section className="my-1">
                <h2 style={{ fontSize: '1rem' }}>
                  <Link href={`/cycle/${post.cycles[0].id}`} passHref>
                    <p className="text-break mb-0 tagText">
                      <a className="cursor-pointer">{post.cycles[0].title}</a>
                    </p>
                  </Link>
                </h2>
              </section>
            </aside>
          )}

        </div>
        <div className='d-flex d-lg-none flex-row flex-wrap my-2'>
          {post.topics && (
            <TagsInput
              className="ms-0 ms-lg-2 d-flex flex-row"
              formatValue={(v: string) => t(dict, `${v}`)}
              tags={post.topics}
              readOnly
            />
          )}
          {post.tags && <TagsInput className="ms-0 ms-lg-2 d-flex flex-row" tags={post.tags} readOnly />}
        </div>
        <Row className="mb-5 d-flex flex-column flex-lg-row">
          <Col className='col-lg-4 col-xl-5'>
            <div className='mb-2 d-none d-lg-block'>
              <MosaicItem cacheKey={cacheKey} className='' postId={post.id} showdetail={false} linkToPost={false} showSaveForLater={true} />
            </div>
            <div className='container d-sm-block d-lg-none mb-2 mt-2 position-relative'>
              <MosaicItem cacheKey={cacheKey} className='postition-absolute start-50 translate-middle-x' postId={post.id} showdetail={false} linkToPost={false} showSaveForLater={true} />
            </div>
          </Col>
          <Col className='col-lg-8 col-xl-7'>
            <div className="px-4">
              <div className={classNames('d-none d-lg-flex flex-row justify-content-between', styles.postInfo)}>
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
                    <Avatar width={28} height={28} userId={post.creator.id} showFullName />
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
              <h1 className="text-secondary fw-bold mb-2  d-none d-lg-block"> {post.title} </h1> {/*titulo y abajo texto eureka*/}
              <div className='d-none d-lg-flex flex-row flex-wrap'>
                {work != null && (
                  <aside className="me-3">
                    <Badge bg="orange" className="rounded-pill py-1 px-2 fw-light text-black tagText">
                      {t(dict, `${work.type}`)}
                    </Badge>
                    <section className="my-1">
                      <h2 className="mb-0" style={{ fontSize: '1rem' }}>
                        <Link href={`/work/${work.id}`} passHref>
                          <p className="text-break mb-0 tagText">
                            <a className="cursor-pointer">{work.title}</a>,{' '}
                            <span className={styles.workInfoAuthor}>{work.author}</span>
                          </p>
                        </Link>
                      </h2>
                    </section>
                  </aside>
                )}
                {post.cycles && post.cycles.length > 0 && (
                  <aside className="">
                    <Badge bg="primary" className="rounded-pill py-1 px-2 fw-light text-dark tagText">
                      {t(dict, 'cycle')}
                    </Badge>
                    <section className="my-1">
                      <h2 style={{ fontSize: '1rem' }}>
                        <Link href={`/cycle/${post.cycles[0].id}`} passHref>
                          <p className="text-break mb-0 tagText">
                            <a className="cursor-pointer">{post.cycles[0].title}</a>
                          </p>
                        </Link>
                      </h2>
                    </section>
                  </aside>
                )}
              </div>
              <div className='d-none d-lg-flex flex-row flex-wrap my-2'>
                {post.topics && (
                  <TagsInput
                    className="ms-0 d-flex flex-row"
                    formatValue={(v: string) => t(dict, `${v}`)}
                    tags={post.topics}
                    readOnly
                  />
                )}
                {post.tags && <TagsInput className="ms-0 ms-lg-2 d-flex flex-row" tags={post.tags} readOnly />}
              </div>
              <div className='mt-3'>
                {(post.contentText != null && post.contentText.length != 0) && <UnclampText text={post.contentText} clampHeight="16rem" />}
              </div>
            </div>
            {/*<div className='container d-none d-lg-block'>
            <CommentsList en
            tity={post} parent={cycle! || work!} cacheKey={['POST', `${post.id}`]} />
          </div>*/}
          </Col>
          <HyvorComments entity='post' id={`${post.id}`} session={session} />
          {/*<div className='container d-sm-block d-lg-none mt-3'>
            <CommentsList entity={post} parent={cycle! || work!} cacheKey={['POST', `${post.id}`]} />
          </div>*/}
        </Row>
      </MosaicContext.Provider>

      {/* )) || <Alert variant="warning">Not found</Alert>} */}
    </article>
  );
}
export default Post;