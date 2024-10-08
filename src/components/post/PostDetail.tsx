import classNames from 'classnames';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { CommentBankOutlined } from '@mui/icons-material';

import timezone from 'dayjs/plugin/timezone';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent } from 'react';
import { Badge } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { DATE_FORMAT_SHORT, WEBAPP_URL } from '../../constants';
import { WorkDetail } from '../../types/work';
// import MosaicItem from './MosaicItemDetail';
import { MosaicContext } from '../../useMosaicContext';
import UnclampText from '../UnclampText';
import styles from './PostDetail.module.css';
import UserAvatar from '../common/UserAvatar';
// import { useCycleContext } from '../../useCycleContext';
import usePost from '@/src/usePostDetail'
import HyvorComments from '@/src/components/common/HyvorComments';
import TagsInput from '@/components/forms/controls/TagsInput';
import Spinner from '../Spinner';
import useUser from '@/src/useUser';
import { Alert, Box, Button, Stack } from '@mui/material';
import useCycle from '@/src/useCycle';
import { Session } from '@/src/types';
import SignInForm from '../forms/SignInForm';
import { useModalContext } from '@/src/hooks/useModal';
import MosaicItem from './MosaicItem';
import { Sumary } from '../common/Sumary';
import { useOnPostCommentCreated } from '../common/useOnPostCommentCreated';

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
  const {show} = useModalContext();

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
);

  const{dispatch}=useOnPostCommentCreated(postId);


  if (!post && !isLoadingPost)
    return <Alert color='warning'>Not found</Alert>;

  if (cycle && !isPublicPost && (!isLoadingUser && !currentUserIsParticipant))
    return <Alert color='warning'>Unauthorized</Alert>;

  if (isLoadingPost||isLoadingUser||isLoadingCycle) return <Spinner />;

  const handleExpandClick = () => {
    if(!session?.user)
     show(<SignInForm/>)
  };


  return (
    <article data-cy="post-detail">
      <MosaicContext.Provider value={{ showShare: true }}>
        <div className={classNames('d-flex d-lg-none flex-row justify-content-between mt-3', styles.postInfo)}>
          <div>
            <Link href={`/mediatheque/${post?.creator.id}`} passHref>
              <UserAvatar userId={post?.creator.id!} />
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
        <Stack direction={{xs:'column',lg:'row'}}>
          <Box sx={{display:{xs:'block',sm:'none'}}}>
            <MosaicItem postId={post?.id!} Width={340} Height={340} />
          </Box>
          <Box sx={{display:{xs:'none',sm:'block',lg:'none'}}}>
            <MosaicItem postId={post?.id!} Width={500} Height={500} />
          </Box>
          <Box sx={{display:{xs:'none',lg:'block'}}}>
            <MosaicItem postId={post?.id!} Width={400} Height={400} />
          </Box>
          <Box paddingLeft={3}>
              <div className={classNames('d-none d-lg-flex flex-row justify-content-between', styles.postInfo)}>
                <div>
                  <Link href={`/mediatheque/${post?.creator.id}`} passHref>
                    <UserAvatar userId={post?.creator.id!} size='small' />
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
                {/* {
                  post?.contentText
                    ? <Box  id="uct" sx={{paddingTop:'1rem',height:'auto',overflowX:'hidden'}} dangerouslySetInnerHTML={{ __html: post?.contentText }} />
                    : <></>
                } */}
                {post?.contentText ? <Sumary description={post?.contentText??''}/> : <></>}
                {
                  !session?.user
                    ? <Box display={'flex'} justifyContent={'center'}>
                        <Button onClick={handleExpandClick} variant='outlined' sx={{textTransform:'none'}}>
                          {t('common:notSessionreplyCommentLbl')}
                        </Button>
                      </Box>
                    : <></>
                }
                
          </Box>
        </Stack>
          <HyvorComments 
            entity='post' 
            id={`${post?.id}`} 
            session={session} 
            OnCommentCreated={(comment)=>dispatch(comment)}
          />
      </MosaicContext.Provider>
    </article>
  );
};

export default PostDetail;
