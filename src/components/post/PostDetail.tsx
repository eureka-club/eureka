import classNames from 'classnames';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent } from 'react';
import { Row, Col, Badge } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { DATE_FORMAT_SHORT, WEBAPP_URL } from '../../constants';
import { WorkDetail } from '../../types/work';
import MosaicItem from './MosaicItemDetail';
import { MosaicContext } from '../../useMosaicContext';
import UnclampText from '../UnclampText';
import styles from './PostDetail.module.css';
import Avatar from '../common/UserAvatar';
// import { useCycleContext } from '../../useCycleContext';
import usePost from '@/src/usePostDetail'
import HyvorComments from '@/src/components/common/HyvorComments';
import TagsInput from '@/components/forms/controls/TagsInput';
import Spinner from '../Spinner';
import useUser from '@/src/useUser';
import { Alert, Box } from '@mui/material';
import useCycle from '@/src/useCycle';
import { Session } from '@/src/types';

interface Props {
  postId: number;
  work?: WorkDetail;
  cacheKey: [string, string];
  showSaveForLater?: boolean;
  session: Session

}

dayjs.extend(utc);
dayjs.extend(timezone);

const PostDetail: FunctionComponent<Props> = ({ postId, work, cacheKey, showSaveForLater = false, session }) => {
  const { t } = useTranslation('createPostForm');
  const router = useRouter();

  //const { data: session, status } = useSession();
  const { data: cycle, isLoading:isLoadingCycle } = useCycle(+router?.query.id!
    // , { enabled: !!router?.query.id! }
  );
  const { data: user, isLoading:isLoadingUser } = useUser(session?.user.id!
    // , { enabled: !!session?.user.id }
  );

  const currentUserIsParticipant = user?.cycles.findIndex(c => c.id == +router.query.id!);
  const isPublicPost = cycle?.access == 1;

  // if(status=='unauthenticated')
  //   router.push(`/cycle/${router.query.id}`);

  const { data: post, isLoading:isLoadingPost } = usePost(+postId
  //   , {
  //   enabled: !!postId
  // }
)

  if (!post && !isLoadingPost)
    return <Alert color='warning'>Not found</Alert>;

  if (cycle && !isPublicPost && (!isLoadingUser && !currentUserIsParticipant))
    return <Alert color='warning'>Unauthorized</Alert>;

  if (isLoadingPost||isLoadingUser||isLoadingCycle) return <Spinner />;

  return (
    <article data-cy="post-detail">
      <MosaicContext.Provider value={{ showShare: true }}>
        <div className={classNames('d-flex d-lg-none flex-row justify-content-between mt-3', styles.postInfo)}>
          <div>
            <Link href={`/mediatheque/${post?.creator.id}`} passHref>
              <Avatar width={28} height={28} userId={post?.creator.id} showFullName />
            </Link>
          </div>
          <div>
            <small className={styles.postDate}>
              {
                dayjs(post?.createdAt).tz(dayjs.tz.guess()).format(DATE_FORMAT_SHORT)
              }
            </small>
          </div>
        </div>

        <h1 className="text-secondary fw-bold mb-2 d-sm-block d-lg-none"> {post?.title} </h1> {/*titulo y abajo texto eureka*/}
        <div className='d-flex d-lg-none flex-row flex-wrap'>
          {work != null && (
            <aside className='me-3' >
              <Badge bg="orange" className="rounded-pill fw-light text-black tagText">
                {t(`common:${work.type}`)}
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
          {post?.cycles && post?.cycles.length > 0 && (
            <aside className=''>
              <Badge bg="primary" className="rounded-pill fw-light text-dark tagText">
                {t('common:cycle')}
              </Badge>
              <section className="my-1">
                <h2 style={{ fontSize: '1rem' }}>
                  <Link href={`/cycle/${post?.cycles[0].id}`} passHref>
                    <p className="text-break mb-0 tagText">
                      <a className="cursor-pointer">{post?.cycles[0].title}</a>
                    </p>
                  </Link>
                </h2>
              </section>
            </aside>
          )}

        </div>
        <div className='d-flex d-lg-none flex-row flex-wrap my-2'>
          {post?.topics && (
            <TagsInput
              className="ms-0 ms-lg-2 d-flex flex-row"
              formatValue={(v: string) => t(`topics:${v}`)}
              tags={post?.topics}
              readOnly
            />
          )}
          {post?.tags && <TagsInput className="ms-0 ms-lg-2 d-flex flex-row" tags={post?.tags} readOnly />}
        </div>
        <Row className="mb-5 d-flex flex-column flex-lg-row">
          <Col className='col-lg-4 col-xl-5'>
            <div className='mb-2 d-none d-lg-block'>
              <MosaicItem cacheKey={cacheKey} className='' postId={post?.id!} showdetail={false} linkToPost={false} showSaveForLater={true} />
            </div>
            <div className='container d-sm-block d-lg-none mb-2 mt-2 position-relative'>
              <MosaicItem cacheKey={cacheKey} className='postition-absolute start-50 translate-middle-x' postId={post?.id!} showdetail={false} linkToPost={false} showSaveForLater={true} />
            </div>
          </Col>
          <Col className='col-lg-8 col-xl-7'>
            <div className="px-4">
              <div className={classNames('d-none d-lg-flex flex-row justify-content-between', styles.postInfo)}>
                <div>
                  <Link href={`/mediatheque/${post?.creator.id}`} passHref>
                    {/* <a>
                  <img
                    src={post?.creator.image || '/img/default-avatar.png'}
                    alt="creator avatar"
                    className={styles.creatorAvatar}
                  />
                  {post?.creator.name}
                </a> */}
                    <Avatar width={28} height={28} userId={post?.creator.id} showFullName />
                  </Link>
                </div>
                <div>
                  <small className={styles.postDate}>
                    {
                      dayjs(post?.createdAt).tz(dayjs.tz.guess()).format(DATE_FORMAT_SHORT)
                      // dayjs(post?.createdAt).format(DATE_FORMAT_SHORT)
                    }
                  </small>
                </div>
              </div>
              <h1 className="text-secondary fw-bold mb-2  d-none d-lg-block"> {post?.title} </h1> {/*titulo y abajo texto eureka*/}
              <div className='d-none d-lg-flex flex-row flex-wrap'>
                {work != null && (
                  <aside className="me-3">
                    <Badge bg="orange" className="rounded-pill py-1 px-2 fw-light text-black tagText">
                      {t(`common:${work.type}`)}
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
                {post?.cycles && post?.cycles.length > 0 && (
                  <aside className="">
                    <Badge bg="primary" className="rounded-pill py-1 px-2 fw-light text-dark tagText">
                      {t('common:cycle')}
                    </Badge>
                    <section className="my-1">
                      <h2 style={{ fontSize: '1rem' }}>
                        <Link href={`/cycle/${post?.cycles[0].id}`} passHref>
                          <p className="text-break mb-0 tagText">
                            <a className="cursor-pointer">{post?.cycles[0].title}</a>
                          </p>
                        </Link>
                      </h2>
                    </section>
                  </aside>
                )}
              </div>
              <div className='d-none d-lg-flex flex-row flex-wrap my-2'>
                {post?.topics && (
                  <TagsInput
                    className="ms-0 d-flex flex-row"
                    formatValue={(v: string) => t(`topics:${v}`)}
                    tags={post?.topics}
                    readOnly
                  />
                )}
                {post?.tags && <TagsInput className="ms-0 ms-lg-2 d-flex flex-row" tags={post?.tags} readOnly />}
              </div>
                {
                  post?.contentText
                    ? <Box  id="uct" sx={{paddingTop:'1rem',height:'auto',overflowX:'hidden'}} dangerouslySetInnerHTML={{ __html: post?.contentText }} />
                    : <></>
                }
              {/* <div className='mt-3'>
                {(post?.contentText != null && post?.contentText.length != 0) && <UnclampText text={post?.contentText} isHTML />}
              </div> */}
            </div>
            {/*<div className='container d-none d-lg-block'>
            <CommentsList en
            tity={post} parent={cycle! || work!} cacheKey={['POST', `${post?.id}`]} />
          </div>*/}
          </Col>
          <HyvorComments 
            entity='post' 
            id={`${post?.id}`} 
            session={session} 
            OnCommentCreated={async (comment)=>{
              const url = `${WEBAPP_URL}/api/hyvor_talk/onCommentCreated/post`;
              const fr = await fetch(url,{
                method:'POST',
                headers:{
                  "Content-Type":"application/json",
                },
                body:JSON.stringify({
                  postId,
                  url:comment.url,
                  user:{name:session.user.name,email:session.user.email},
                  parent_id:comment.parent_id,
                })
              });
              if(fr.ok){
                const res = await fr.json();
                console.log(res);
              }
            }}
          />
          {/*<div className='container d-sm-block d-lg-none mt-3'>
            <CommentsList entity={post} parent={cycle! || work!} cacheKey={['POST', `${post?.id}`]} />
          </div>*/}
        </Row>
      </MosaicContext.Provider>

      {/* )) || <Alert variant="warning">Not found</Alert>} */}
    </article>
  );
};

export default PostDetail;
