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
    {/* <Grid container>
      {cycles.map((c) => (
        <Grid item
          xs={12}
          sm={6}
          lg={3}
          xl={2}
          key={c.id}
        >
          <CMI
            cycleId={c.id}
            cacheKey={['CYCLES', `WORK-${workId}`]}
            size={'md'}
            showSaveForLater={false}
          />
        </Grid>
      ))}
    </Grid> */}
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

  // const renderSpinnerForLoadNextCarousel = () => {
  //   if (hasMorePosts) return <Spinner animation="grow" />;
  //   return '';
  // };

  const handleSubsectionChange = (key: string | null) => {
    if (key != null) {
      setDefaultActiveKey(key);
      setDetailPagesState({ ...detailPagesState, selectedSubsectionWork: key });
    }
  };

  
  

  /*const handleEditPostOnSmallerScreen = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
        setEditPostOnSmallerScreen({ ...editOnSmallerScreens, ...{ value: !editPostOnSmallerScreen.value } });
  };*/

  // const renderPosts = () => {
  //   if (posts) {
  //     return (
  //       <>
  //         <WorkDetailPost
  //           workId={work.id}
  //           className="mb-2"
  //           cacheKey={['POSTS', JSON.stringify(workPostsWhere)]}
  //         ></WorkDetailPost>
  //         <Row className="mt-5">
  //           {posts.map((p) => (
  //             <Col
  //               key={p.id}
  //               xs={12}
  //               sm={6}
  //               lg={3}
  //               xxl={2}
  //               className="mb-5 d-flex justify-content-center  align-items-center"
  //             >
  //               <MosaicItemPost cacheKey={['POST', `${p.id}`]} postId={p.id} size={'md'} showSaveForLater={true} />
  //             </Col>
  //           ))}
  //         </Row>
  //         <div className="mt-5" ref={ref}>
  //           {hasMorePosts ? <Spinner animation="grow" /> : <></>}
  //         </div>
  //       </>
  //     );
  //   }
  //   return '';
  // };

  // const renderCycles = () => {
  //   if (cycles) {
  //     return (
  //       <Row className="mt-5">
  //         {cycles.map((c) => (
  //           <Col
  //             xs={12}
  //             sm={6}
  //             lg={3}
  //             xxl={2}
  //             className="mb-5 d-flex justify-content-center  align-items-center"
  //             key={c.id}
  //           >
  //             <CMI cycleId={c.id} cacheKey={['CYCLES', `WORK-${workId}`]} size={'md'} showSaveForLater={true} />
  //           </Col>
  //         ))}
  //       </Row>
  //     );
  //   }
  //   return <></>;
  // };

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
  
  return (
    // <WorkContext.Provider value={{ work, linkToWork: false }}>
      <MosaicContext.Provider value={{ showShare: true }}>
        {
          <Stack gap={6}>
            <Suspense fallback={<CircularProgress/>}>
              {post == null ? (
              <>
                  <Stack gap={{xs:2}}  direction={{xs:'column',sm:'row'}}>
                  <Stack gap={1} sx={{ display: { xs: 'block', sm: 'none' } }} >
                      <h1 className="fw-bold text-secondary">{work.title}</h1>
                      <h2 className={`${styles.author}`}>{work.author}</h2>
                      <WorkSummary work={work as unknown as WorkSumary} />
                      <Rating qty={getRatingQty()??0} onChange={handlerChangeRating} size="medium" readonly />
                      <Typography >
                              {getRatingAvg()}
                              {' - '}
                              <span className="ms-1 text-gray">{getRatingQty()} {t('common:ratings')}</span>
                            </Typography>
                     
                          </Stack>
                    <Stack gap={1}>
                      <MosaicItem workId={work.id} Width={250} Height={250*1.36}/>
                      <Box>
                        <Stack direction={'row'} alignItems={'stretch'} gap={1}>
                          <Rating
                            qty={getCurrentUserRating()}
                            onChange={handlerChangeRating}
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
                        <Stack gap={1}>
                          <WorkReadOrWatched work={work} sx={{textTransform:'none',width:'250px'}} />
                          <ShareWork sx={{textTransform:'none',width:'250px'}}/>
                          <SaveForLater sx={{textTransform:'none',width:'250px'}}/>
                        </Stack>
                      </Box>
                    </Stack>
                    <Stack>
                      <Stack gap={1} sx={{ display: { xs: 'none', sm: 'block' } }} >
                      <h1 className="fw-bold text-secondary">{work.title}</h1>
                      <h2 className={`${styles.author}`}>{work.author}</h2>
                      <WorkSummary work={work as unknown as WorkSumary} />
                      </Stack>
                      
                      <Stack direction={{sm:'column',md:'row'}} gap={1}>
                          <Stack direction={'row'} sx={{ display: { xs: 'none', sm: 'block' } }} >
                            <Rating qty={getRatingAvg()} onChange={handlerChangeRating} size="medium" readonly />
                            <Typography>
                              {getRatingAvg()}
                              {' - '}
                              <span className="ms-1 text-gray">{getRatingQty()} {t('common:ratings')}</span>
                            </Typography>
                          </Stack>
                          <Box>
                            <TagsLinks topics={topics??[]}/>
                            {work.tags && <TagsInput className="ms-0 ms-lg-2 d-flex flex-row" tags={work.tags} readOnly />}
                          </Box>
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
                                ? <Button onClick={()=>{
                                  show(<SignInForm/>);
                                }}>
                                    <CommentBankOutlined /> Escreva um comentario
                                  </Button>
                                : <></>
                            }
                      </Box>
                      </Stack>
                    {/* </Stack> */}
                  </Stack>
                  
                  {/* <Stack display={{xs:'inherit',md:'none'}}>
                    <Box dangerouslySetInnerHTML={{ __html: work.contentText! }}/>
                    <Box>
                          {
                          !session?.user
                            ? <Button size='small' variant='contained' onClick={()=>{
                              show(<SignInForm/>);
                            }}>{t('common:comment')}</Button>
                            : <></>
                          }
                    </Box>
                  </Stack> */}
                  
                 <HyvorComments 
                    entity="work" 
                    id={`${work.id}`} 
                    session={session} 
                    OnCommentCreated={dispatch}
                  />
              {/* <Grid container sx={{display:{lg:'inherit'}}}>
                <Grid item lg={4}>
                </Grid>

                 <Grid item lg={8}>
                  <Stack>
                    <h1 className="fw-bold text-secondary">{work.title}</h1>
                    <h2 className={`${styles.author}`}>{work.author}</h2>
                    <WorkSummary work={work as unknown as WorkSumary} />
                    <div className="d-flex flex-wrap flex-row mt-2 mb-2">
                      <Box sx={{ display: 'flex' }}>
                        <Rating qty={work.ratingAVG??0} onChange={handlerChangeRating} size="medium" readonly />
                        <div className="d-flex flex-nowrap ms-2">
                          {getRatingAvg().toFixed(1)}
                          {' - '}
                          {getRatingQty()}
                        </div>
                        <span className="ms-1 text-gray">{t('common:ratings')}</span>
                      </Box>
                      <TagsLinks topics={topics??[]}/>
                      
                      {work.tags && <TagsInput className="ms-0 ms-lg-2 d-flex flex-row" tags={work.tags} readOnly />}
                    </div>
                    <Stack gap={1}>
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
                     <Box dangerouslySetInnerHTML={{ __html: work.contentText! }}/>
                    </Stack>
                    <HyvorComments entity="work" id={`${work.id}`} session={session} />
                  </Stack>
                </Grid> 
              </Grid> */}
              
              {/* <Grid container>
                <Grid item lg={4}>
                  <Stack sx={{display:{xs:'none',md:'inherit'}}}>
                    <MosaicItem
                        workId={work.id}
                        showTrash
                        linkToWork={false}
                        size={'lg'}
                        showCreateEureka={false}
                        showSaveForLater={true}
                    />
                    <Box className="d-flex flex-row align-items-baseline" mt={1}>
                      <Rating
                        qty={work?.currentUserRating??0}
                        onChange={handlerChangeRating}
                        size="medium"
                        iconColor="var(--bs-danger)"
                      /> { (work?.currentUserRating??0) > 0 && <Button
                        type="button"
                        title={t('common:clearRating')}
                        color='warning'
                        // className="text-warning p-0 ms-2"
                        onClick={clearRating}
                        // variant="link"
                        //disabled={loadingSocialInteraction}
                      >
                        <FiTrash2 />
                      </Button>}
                    </Box>
                    <Box mt={1}>
                      <WorkReadOrWatched work={work} />
                    </Box>
                  </Stack>
                </Grid>
                <Grid item lg={8}>
                  <Stack>
                    <h1 className="fw-bold text-secondary">{work.title}</h1>
                    <h2 className={`${styles.author}`}>{work.author}</h2>
                    <WorkSummary work={work as unknown as WorkSumary} />
                    <div className="d-flex flex-wrap flex-row mt-2 mb-2">
                      <Box sx={{ display: 'flex' }}>
                        <Rating qty={work.ratingAVG??0} onChange={handlerChangeRating} size="medium" readonly />
                        <div className="d-flex flex-nowrap ms-2">
                          {getRatingAvg().toFixed(1)}
                          {' - '}
                          {getRatingQty()}
                        </div>
                        <span className="ms-1 text-gray">{t('common:ratings')}</span>
                      </Box>
                      <TagsLinks topics={topics??[]}/>
                      
                      {work.tags && <TagsInput className="ms-0 ms-lg-2 d-flex flex-row" tags={work.tags} readOnly />}
                    </div>
                    <Stack gap={1}>
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
                     <Box dangerouslySetInnerHTML={{ __html: work.contentText! }}/>
                     
                    </Stack>
                    
                    <div className="d-xs-block d-lg-none position-relative">
                      <MosaicItem
                        className="postition-absolute start-50 translate-middle-x"
                        work={work as unknown as WorkSumary}
                        workId={work.id}
                        showTrash
                        linkToWork={false}
                        size={'lg'}
                        showCreateEureka={false}
                        showSaveForLater={true}
                      />
                      <Box className="d-flex flex-row justify-content-center align-items-baseline" mt={2}>
                        <Rating
                          qty={work.currentUserRating??0}
                          onChange={handlerChangeRating}
                          size="medium"
                          iconColor="var(--bs-danger)"
                        /> {(work.currentUserRating??0) > 0 && <Button
                          type="button"
                          color='warning'
                          title={t('common:clearRating')}
                          onClick={clearRating}
                        >
                          <FiTrash2 />
                        </Button>}
                      </Box>
                      <Box className="d-flex justify-content-center" mt={1}>
                        <WorkReadOrWatched work={work} />
                      </Box>
                    </div>
                    
                    <HyvorComments entity="work" id={`${work.id}`} session={session} />
                  </Stack>
                </Grid>
              </Grid> */}
             
                {/* <Grid container className="mb-5 d-flex flex-column flex-lg-row">
                    <Grid item md={12} lg={4} xl={3} sx={{display:{xs:'none'}}}>
                      <MosaicItem
                        workId={work.id}
                        showTrash
                        linkToWork={false}
                        size={'lg'}
                        showCreateEureka={false}
                        showSaveForLater={true}
                      />
                      <Box className="d-flex flex-row align-items-baseline" mt={1}>
                        <Rating
                          qty={work?.currentUserRating??0}
                          onChange={handlerChangeRating}
                          size="medium"
                          iconColor="var(--bs-danger)"
                        /> { (work?.currentUserRating??0) > 0 && <Button
                          type="button"
                          title={t('common:clearRating')}
                          className="text-warning p-0 ms-2"
                          onClick={clearRating}
                          variant="link"
                          //disabled={loadingSocialInteraction}
                        >
                          <FiTrash2 />
                        </Button>}
                      </Box>
                      <Box mt={1}>
                        <WorkReadOrWatched work={work} />
                      </Box>
                    </Grid> */}
                    {/* <Grid item md={12} lg={8} xl={9} >
                      <section className="mx-md-4">
                        <h1 className="fw-bold text-secondary">{work.title}</h1>
                        <h2 className={`${styles.author}`}>{work.author}</h2>
                        <WorkSummary work={work as unknown as WorkSumary} />
                        <div className="d-flex flex-wrap flex-row mt-2 mb-2">
                          <Box sx={{ display: 'flex' }}>
                            <Rating qty={work.ratingAVG??0} onChange={handlerChangeRating} size="medium" readonly />
                            <div className="d-flex flex-nowrap ms-2">
                              {getRatingAvg().toFixed(1)}
                              {' - '}
                              {getRatingQty()}
                            </div>
                            <span className="ms-1 text-gray">{t('common:ratings')}</span>
                          </Box>
                          <TagsLinks topics={topics??[]}/>
                          
                          {work.tags && <TagsInput className="ms-0 ms-lg-2 d-flex flex-row" tags={work.tags} readOnly />}
                        </div>
                        {work.link != null && (
                          <a
                            href={work.link}
                            className={classNames(styles.workLink, 'mb-5')}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {t('workLinkLabel')} <BsBoxArrowUpRight />
                          </a>
                        )}
                        <div className="container d-sm-block d-lg-none mt-4 mb-4 position-relative">
                          <MosaicItem
                            className="postition-absolute start-50 translate-middle-x"
                            work={work as unknown as WorkSumary}
                            workId={work.id}
                            showTrash
                            linkToWork={false}
                            size={'lg'}
                            showCreateEureka={false}
                            showSaveForLater={true}
                          />
                          <Box className="d-flex flex-row justify-content-center align-items-baseline" mt={2}>
                            <Rating
                              qty={work.currentUserRating??0}
                              onChange={handlerChangeRating}
                              size="medium"
                              iconColor="var(--bs-danger)"
                            /> {(work.currentUserRating??0) > 0 && <Button
                              type="button"
                              title={t('common:clearRating')}
                              className="text-warning p-0 ms-2"
                              onClick={clearRating}
                              variant="link"
                              //disabled={loadingSocialInteraction}
                            >
                              <FiTrash2 />
                            </Button>}
                          </Box>
                          <Box className="d-flex justify-content-center" mt={1}>
                            <WorkReadOrWatched work={work} />
                          </Box>
                        </div>
                        <Box className="" mt={1}>
                        {work.contentText != null && (
                          <UnclampText isHTML={true} text={work.contentText} />
                        )}
                      </Box>
                      
                      </section>
                    
                      <HyvorComments entity="work" id={`${work.id}`} session={session} />
                    </Grid> 
                  </Grid>*/}
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
                    
                    // <TabContainer
                    //   // defaultActiveKey={defaultActiveKey}
                    //   activeKey={defaultActiveKey}
                    //   onSelect={handleSubsectionChange}
                    //   transition={true}
                    // >
                    //   <style jsx global>
                    //     {`
                    //           .nav-tabs .nav-item.show .nav-link,
                    //           .nav-tabs .nav-link.active,
                    //           .nav-tabs .nav-link:hover {
                    //             cursor: pointer;
                    //             background-color: var(--bs-primary);
                    //             color: white !important;
                    //             border: none !important;
                    //             border-bottom: solid 2px var(--bs-primary) !important;
                    //           }
                    //           .nav-tabs {
                    //             border-bottom: solid 1px var(--bs-primary) !important;
                    //           }
                    //         `}
                    //   </style>
                     
                      
                      
                    //   <Row className="mb-4">
                    //     <Col>
                    //       <div className="">
                    //         <Nav variant="tabs" className="scrollNav" fill>
                    //           {/*<NavItem>
                    //             <NavLink eventKey="discussion">
                    //               {t('discussion')}
                    //             </NavLink>
                    //           </NavItem> */}
                    //           <NavItem>
                    //             <NavLink eventKey="posts" data-cy="posts">
                    //               {t('tabHeaderPosts')} ({dataPosts?.total})
                    //             </NavLink>
                    //           </NavItem>
                    //           <NavItem>
                    //             <NavLink eventKey="cycles">
                    //               {t('tabHeaderCycles')} ({cyclesCount})
                    //             </NavLink>
                    //           </NavItem>
                    //         </Nav>
                    //       </div>
                    //     </Col>
                    //   </Row>
                    //   <Row>
                    //     <Col>
                    //       <TabContent>
                    //         {/*<TabPane eventKey="discussion"> 
                    //             <HyvorComments entity='work' id={`${work.id}`}  />
                    //           </TabPane>*/}
                    //         <TabPane eventKey="posts">
                    //           {posts ? (
                    //             <>
                    //               <WorkDetailPost
                    //                 workId={work.id}
                    //                 className="mb-2"
                    //                 cacheKey={['POSTS', JSON.stringify(workPostsWhere)]}
                    //               ></WorkDetailPost>
                    //               <Row className="mt-5">
                    //                 {posts.map((p) => (
                    //                   <Col
                    //                     key={p.id}
                    //                     xs={12}
                    //                     sm={6}
                    //                     lg={3}
                    //                     xxl={2}
                    //                     className="mb-5 d-flex justify-content-center  align-items-center"
                    //                   >
                    //                     <MosaicItemPost
                    //                       cacheKey={['POST', `${p.id}`]}
                    //                       postId={p.id}
                    //                       size={'md'}
                    //                       showSaveForLater={false}
                    //                     />

                    //                   </Col>
                    //                 ))}
                    //               </Row>
                    //               {/* TODO this make rerender the hyvor talk but is needed <div className="mt-5" ref={ref}>
                    //                   {hasMorePosts ? <Spinner animation="grow" />
                    //                   :<></>}
                    //                 </div> */}
                    //             </>
                    //           ) : (
                    //             <></>
                    //           )}
                    //         </TabPane>
                    //         <TabPane eventKey="cycles">
                    //           {cycles ? (
                    //             <Row className="mt-5">
                    //               {cycles.map((c) => (
                    //                 <Col
                    //                   xs={12}
                    //                   sm={6}
                    //                   lg={3}
                    //                   xxl={2}
                    //                   className="mb-5 d-flex justify-content-center  align-items-center"
                    //                   key={c.id}
                    //                 >
                    //                   <CMI
                    //                     cycleId={c.id}
                    //                     cacheKey={['CYCLES', `WORK-${workId}`]}
                    //                     size={'md'}
                    //                     showSaveForLater={false}
                    //                   />
                    //                 </Col>
                    //               ))}
                    //             </Row>
                    //           ) : (
                    //             <></>
                    //           )}
                    //         </TabPane>
                    //       </TabContent>
                    //     </Col>
                    //   </Row>
                    // </TabContainer>
                  )}
              </>
              // <Row>
              //   <Col>
              //   </Col>
              // </Row>
            )}
          </Stack>
          // : <EditPostForm noModal cacheKey={['POSTS', JSON.stringify(workPostsWhere)]} />
        }
    </MosaicContext.Provider>
    // </WorkContext.Provider
  );
};

export default WorkDetailComponent;
