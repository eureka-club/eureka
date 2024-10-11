import { FunctionComponent, useState, lazy, Suspense, useMemo, useEffect, FC, ReactElement } from 'react';
import classNames from 'classnames';
import { useAtom } from 'jotai';
import useTranslation from 'next-translate/useTranslation';
import { BsBoxArrowUpRight } from 'react-icons/bs';
import { useRouter } from 'next/router';
import { PostDetail, PostSumary } from '@/src/types/post';
import WorkSummary from './WorkSummary';
import WorkReadOrWatched from './WorkReadOrWatched';
import detailPagesAtom from '@/src/atoms/detailPages';
import { CommentBankOutlined } from '@mui/icons-material';

//import globalModalsAtom from '@/src/atoms/globalModals';
// import editOnSmallerScreens from '../../atoms/editOnSmallerScreens';
import styles from './WorkDetail.module.css';
import TagsInput from '@/components/forms/controls/TagsInput';
import MosaicItem from './MosaicItem';
import { MosaicContext } from '@/src/useMosaicContext';
import useCycles from '@/src/useCycles';
import WorkDetailPost from './WorkDetailPost';
import CMI from '@/src/components/cycle/MosaicItem';
import MosaicItemPost from '@/src/components/post/MosaicItem';
import { useInView } from 'react-intersection-observer';
import { Session } from '@/src/types';
import HyvorComments from '@/src/components/common/HyvorComments';
import useExecRatingWork from '@/src/hooks/mutations/useExecRatingWork';
import Rating from '../common/Rating';
import { Box, Button, CircularProgress, IconButton, Stack, Typography } from '@mui/material';
import { FiTrash2 } from 'react-icons/fi';
import useWorkDetail from '@/src/useWorkDetail';
import { WorkSumary } from '@/src/types/work';
import { TagsLinks } from '../common/TagsLinks';
import useTopics, { TopicItem } from '@/src/useTopics';
import { MosaicsGrid } from '../MosaicsGrid';
import { TabPanelSwipeableViews } from '../common/TabPanelSwipeableViews';
// import { useIsFetching } from 'react-query';
import SignInForm from '../forms/SignInForm';
import { useModalContext } from '@/src/hooks/useModal';
import usePostsSumary, { getPostsSumary } from '@/src/usePostsSumary';
import { Sumary } from '../common/Sumary';
import { useOnWorkCommentCreated } from '../common/useOnWorkCommentCreated';
import Masonry from '@mui/lab/Masonry';
import { useSaveWorkForLater } from './useSaveWorkForLater';
import { useShareWork } from './useShareWork';

const PostDetailComponent = lazy(() => import('@/components/post/PostDetail'));

interface Props {
  workId: number;
  post?: PostDetail;
  session: Session;
}
interface TabPostsProps{
  workId:any;
  posts:PostSumary[];
  cacheKey:string[];
  isLoading:boolean;
}
const TabPosts:FC<TabPostsProps> = ({isLoading,workId,posts,cacheKey}:TabPostsProps)=>{

  return <Stack gap={3} alignContent={'space-between'}>
    <p>{``}</p>
    <WorkDetailPost
      workId={workId}
      cacheKey={cacheKey}
    ></WorkDetailPost>
    {/* <MosaicsGrid isLoading={isLoading}> */}
    <Masonry columns={{xs:1,sm:3,md:3,lg:4}} spacing={1}>
        {
          posts.map(p=><MosaicItemPost key={p.id} postId={p.id} sx={{
            'img':{
              width:'100%',
              height:'auto',
            }
          }} />
        )}
      </Masonry>
    {/* </MosaicsGrid> */}
  </Stack>
}

interface TabCyclesProps{
  workId:any;
  cycles:any[]
}
const TabCycles:FC<TabCyclesProps>=({workId,cycles})=>{
  return <Stack gap={3}>
    <p>{` `}</p>
     <MosaicsGrid>
      {cycles.map((c,idx)=><CMI cycleId={c.id} key={`${c.id}-${idx}`} size={'medium'}/>
      )}
    </MosaicsGrid> 
  </Stack>
}

const WorkDetailComponent: FunctionComponent<Props> = ({ workId, post, session }) => {
  const router = useRouter();
  const {show} = useModalContext();

  const [detailPagesState, setDetailPagesState] = useAtom(detailPagesAtom);
  //const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  const { t,lang } = useTranslation('workDetail');
  //const [editPostOnSmallerScreen,setEditPostOnSmallerScreen] = useAtom(editOnSmallerScreens);
  const [ref, inView] = useInView({
    triggerOnce: false,
    // rootMargin: '200px 0px',
    // skip: supportsLazyLoading !== false,
  });

  const { data: work } = useWorkDetail(workId
  //   , {
  //   enabled: !!workId,
  // }
);
  const{dispatch}=useOnWorkCommentCreated(workId);

  const{data:topicsAll}=useTopics();
  const topics:TopicItem[] = useMemo(()=>{
    if(work && topicsAll){
      return (work?.topics??"")
        .split(',')
        .map(ts=>{
        const topic = topicsAll?.find(t=>t.code==ts);
        return {code:ts,emoji:topic ? topic.emoji: '',label:ts};
      });
    }
    return [];
  },[work,topicsAll]);

  const workCyclessWhere = {
    where: {
      works: {
        some: {
          id: workId,
        },
      },
    },
  };
  const [workPostsWhere] = useState<Record<string, any>>({
    take: 8,
    where: {
      works: {
        some: {
          id: workId,
        },
      },
    },
  });
  const { data: dataCycles } = useCycles('',workCyclessWhere
  // , { enabled: !!workId }
);
  const { data: dataPosts,isLoading } = usePostsSumary(workPostsWhere
    // , { enabled: !!workId }
  ); //OJO this trigger just once -load the same data that page does
  const [posts, setPosts] = useState(dataPosts?.posts);
  const [cycles, setCycles] = useState(dataCycles?.cycles);
  const [defaultActiveKey, setDefaultActiveKey] = useState<string>('posts');

  const [hasMorePosts, setHasMorePosts] = useState(dataPosts?.fetched);

  const { mutate: execRating } = useExecRatingWork({
    work: work!,
  });

  const{SaveForLater}=useSaveWorkForLater(workId);
  const{ShareWork}=useShareWork(workId);

  useEffect(() => {
    if (dataPosts && dataPosts.posts) {
      setHasMorePosts(dataPosts.fetched);
      setPosts(dataPosts.posts);
      if (dataPosts.posts.length) setDefaultActiveKey('posts');
    }
  }, [dataPosts]);

  useEffect(() => {
    if (dataCycles && dataCycles.cycles) {
      setCycles(dataCycles.cycles);
      if (dataCycles.cycles.length && !posts?.length) setDefaultActiveKey('cycles');
    }
    if (router.query.tabKey) setDefaultActiveKey(router.query.tabKey.toString());
  }, [dataCycles, posts]);

  useEffect(() => {
    if (inView && hasMorePosts) {
      if (posts) {
        const loadMore = async () => {
          const { id } = posts.slice(-1)[0];
          const o = { ...workPostsWhere, skip: 1, cursor: { id } };
          const { posts: pf, fetched } = await getPostsSumary(session.user.id,lang,o);
          setHasMorePosts(fetched);
          const posts_ = [...(posts || []), ...pf];
          setPosts(posts_);
        };
        loadMore();
      }
    }
  }, [inView]);

  let cyclesCount = 0;
  if (cycles) cyclesCount = cycles.length;

  if (!work) return <></>;

  const handleSubsectionChange = (key: string | null) => {
    if (key != null) {
      setDefaultActiveKey(key);
      setDetailPagesState({ ...detailPagesState, selectedSubsectionWork: key });
    }
  };

  

  const handlerChangeRating = (value: number) => {
    execRating({
      ratingQty: value,
      doCreate: value ? true : false,
    });
  };

  const clearRating = () => {
    execRating({
      ratingQty: 0,
      doCreate: false,
    });
  };

  const getRatingQty = () => {
    return work?._count.ratings??0;
  };

  const getRatingAvg = () => {
    if (work && work._count.ratings) {
      return +(work.ratings.reduce((p,c)=>{return p+c.qty},0)/work._count.ratings || 0).toFixed(1);
    }
    return 0;
  };

  const getCurrentUserRating = ()=>{
    if(session && work)
      return work?.ratings.find(r=>r.userId==session?.user.id)?.qty??0;
    return 0;
  }

  const handleExpandClick = () => {
    if(!session?.user)
     show(<SignInForm/>)
  };
  
  return (
    // <WorkContext.Provider value={{ work, linkToWork: false }}>
      <MosaicContext.Provider value={{ showShare: true }}>
        {
          <Stack gap={6}>
            <Suspense fallback={<CircularProgress/>}>
              {post == null ? (
              <>
                  <Stack gap={{xs:2}}  direction={{xs:'column',sm:'row'}}>
                    <Stack gap={1} sx={{ display: { xs: 'flex', sm: 'none' } }} >
                        <h1 className="fw-bold text-secondary">{work.title}</h1>
                        <h2 className={`${styles.author}`}>{work.author}</h2>
                        <WorkSummary work={work as unknown as WorkSumary} />
                        <Stack direction={'row'} gap={1}>
                          <Rating qty={getRatingAvg()??0} OnChange={handlerChangeRating} size="medium" readonly sx={{padding:'.5rem 0'}} />
                          <Typography >
                            {getRatingAvg()}
                            {' - '}
                          </Typography>
                          <Typography>{getRatingQty()} {t('common:ratings')}</Typography>
                        </Stack>
                        <Stack direction={'row'}  flexWrap={'wrap'}>
                          <TagsLinks topics={topics??[]}/>
                          {work.tags && <TagsInput className="ms-0 ms-lg-2 d-flex flex-row" tags={work.tags} readOnly />}
                        </Stack>
                      
                    </Stack>
                    <Stack gap={1}>
                      <MosaicItem workId={work.id} Width={250} Height={250*1.36}/>
                        <Stack gap={1}>
                          <Stack direction={'row'} alignItems={'stretch'} gap={1}>
                            <Rating
                              qty={getCurrentUserRating()}
                              OnChange={handlerChangeRating}
                              size="medium"
                              iconColor="var(--bs-danger)"
                            /> { (getCurrentUserRating()) > 0 && <IconButton
                              type="button"
                              size='small'
                              title={t('common:clearRating')}
                              color='warning'
                              onClick={clearRating}
                              // disabled={loadingSocialInteraction}
                            >
                              <FiTrash2 />
                            </IconButton>}
                          </Stack>
                          <WorkReadOrWatched work={work} sx={{textTransform:'none',width:'250px'}} />
                          <ShareWork sx={{textTransform:'none',width:'250px'}}/>
                          <SaveForLater sx={{textTransform:'none',width:'250px'}}/>
                        </Stack>
                    </Stack>
                    <Stack>
                      <Stack gap={1} sx={{ display: { xs: 'none', sm: 'block' } }} >
                        <h1 className="fw-bold text-secondary">{work.title}</h1>
                        <h2 className={`${styles.author}`}>{work.author}</h2>
                        <WorkSummary work={work as unknown as WorkSumary} />
                      </Stack>
                      
                      <Stack sx={{ display: { xs: 'none', sm: 'flex' } }} gap={1}>
                          <Stack direction={'row'}  gap={1}>
                            <Rating qty={getRatingAvg()} OnChange={handlerChangeRating} size="medium" readonly />
                            <Typography>
                              {getRatingAvg()}
                              {' - '}
                            </Typography>
                            <Typography>{getRatingQty()} {t('common:ratings')}</Typography>
                          </Stack>
                          <Stack direction={'row'}  flexWrap={'wrap'}>
                           <TagsLinks topics={topics??[]}/>
                            {work.tags && <TagsInput className="ms-0 ms-lg-2 d-flex flex-row" tags={work.tags} readOnly />}
                          </Stack>
                      </Stack>
                      <Box sx={{paddingBlock:1}}>
                      {work.link != null && (
                          <a
                            href={work.link}
                            className={classNames(styles.workLink)}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {t('workLinkLabel')} <BsBoxArrowUpRight />
                          </a>
                        )}
                      </Box>
                      
                      {/* <Stack display={{xs:'none',md:'inherit'}}> */}
                      

                      <Sumary description={work?.contentText??''}/>
                        <Box>
                            {
                              !session 
                                ? <Box display={'flex'} justifyContent={'center'}>
                                    <Button onClick={handleExpandClick} variant='outlined' sx={{textTransform:'none'}}>
                                    {t('common:notSessionreplyCommentLbl')}
                                    </Button>
                                </Box>
                                : <></>
                            }
                      </Box>
                      
                    </Stack>
                    {/* </Stack> */}
                  </Stack>
                  
                  <HyvorComments 
                    entity="work" 
                    id={`${work.id}`} 
                    session={session} 
                    OnCommentCreated={dispatch}
                  />
              </>
            ) : (
            <>
              {post && work && (
                <PostDetailComponent
                  showSaveForLater={true}
                  postId={post.id}
                  work={work}
                  cacheKey={['POST', `${post.id}`]}
                  session={session}
                />
              )}
            </>
              )}
            </Suspense>

            {post == null && (
              <>
                  {detailPagesState.selectedSubsectionWork != null && (
                    <TabPanelSwipeableViews indexActive={0} items={[
                      {
                        label:<Typography>{t('tabHeaderPosts')} ({dataPosts?.total})</Typography>,
                        content: posts 
                          ? <TabPosts  isLoading={isLoading} workId={workId} posts={posts} cacheKey={['POSTS', JSON.stringify(workPostsWhere)]} />
                          : <></>
                      },
                      {
                        label:<Typography>{t('tabHeaderCycles')} ({cyclesCount})</Typography>,
                        content:cycles?.length 
                          ? <TabCycles workId={workId} cycles={cycles}/>
                          : <></>
                      }
                    ]}>
                    </TabPanelSwipeableViews>
                    
                  )}
              </>
              
            )}
          </Stack>
        }
    </MosaicContext.Provider>
  );
};

export default WorkDetailComponent;
