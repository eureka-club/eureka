import { FunctionComponent, useState, lazy, Suspense, useMemo, useEffect, FC, ReactElement } from 'react';
import classNames from 'classnames';
import { useAtom } from 'jotai';
import useTranslation from 'next-translate/useTranslation';

import Button from '@mui/material/Button'
import { BsBoxArrowUpRight } from 'react-icons/bs';
// import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { PostDetail } from '@/src/types/post';
import UnclampText from '@/components/UnclampText';
import WorkSummary from './WorkSummary';
import WorkReadOrWatched from './WorkReadOrWatched';
import detailPagesAtom from '@/src/atoms/detailPages';
//import globalModalsAtom from '@/src/atoms/globalModals';
// import editOnSmallerScreens from '../../atoms/editOnSmallerScreens';
import styles from './WorkDetail.module.css';
import TagsInput from '@/components/forms/controls/TagsInput';
import MosaicItem from './MosaicItem';
import { MosaicContext } from '@/src/useMosaicContext';
import useCycles from '@/src/useCycles';
import usePosts, { getPosts } from '@/src/usePosts';
import WorkDetailPost from './WorkDetailPost';
import CMI from '@/src/components/cycle/MosaicItem';
import MosaicItemPost from '@/src/components/post/MosaicItem';
import { useInView } from 'react-intersection-observer';
import { Session } from '@/src/types';
import HyvorComments from '@/src/components/common/HyvorComments';
import useExecRatingWork from '@/src/hooks/mutations/useExecRatingWork';
import Rating from '../common/Rating';
import { Box, CircularProgress, Grid, Stack, Tab, Tabs, Typography } from '@mui/material';
import { FiTrash2 } from 'react-icons/fi';
import useWorkDetail from '@/src/useWorkDetail';
import { WorkSumary } from '@/src/types/work';
import { TagsLinks } from '../common/TagsLinks';
import useTopics, { TopicItem } from '@/src/useTopics';
import { TabPanel } from '../common/TabPanel';


const PostDetailComponent = lazy(() => import('@/components/post/PostDetail'));

interface Props {
  workId: number;
  post?: PostDetail;
  session: Session;
}
interface TabPostsProps{
  workId:any;
  posts:{id:any}[];
  cacheKey:string[];
}
const TabPosts:FC<TabPostsProps> = ({workId,posts,cacheKey}:TabPostsProps)=>{
  return <Stack gap={3} alignContent={'space-between'}>
    <p>{``}</p>
    <WorkDetailPost
      workId={workId}
      cacheKey={cacheKey}
    ></WorkDetailPost>
    <Grid container>
      {posts.map((p) => (
        <Grid item
          key={p.id}
          xs={12}
          sm={6}
          lg={3}
          xl={2}
        >
          <MosaicItemPost
            cacheKey={['POST', `${p.id}`]}
            postId={p.id}
            size={'md'}
            showSaveForLater={false}
          />
        </Grid>
      ))}
    </Grid>
    {/* TODO this make rerender the hyvor talk but is needed <div className="mt-5" ref={ref}>
        {hasMorePosts ? <Spinner animation="grow" />
        :<></>}
      </div> */}
</Stack>
}

interface TabCyclesProps{
  workId:any;
  cycles:any[]
}
const TabCycles:FC<TabCyclesProps>=({workId,cycles})=>{
  return <Stack gap={3}>
    <p>{` `}</p>
    <Grid container>
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
    </Grid>
  </Stack>
}

const WorkDetailComponent: FunctionComponent<Props> = ({ workId, post, session }) => {
  const router = useRouter();
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
console.log(work)
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
  const { data: dataPosts } = usePosts(workPostsWhere
    // , { enabled: !!workId }
  ); //OJO this trigger just once -load the same data that page does
  const [posts, setPosts] = useState(dataPosts?.posts);
  const [cycles, setCycles] = useState(dataCycles?.cycles);
  const [defaultActiveKey, setDefaultActiveKey] = useState<string>('posts');

  const [hasMorePosts, setHasMorePosts] = useState(dataPosts?.fetched);

  const { mutate: execRating } = useExecRatingWork({
    work: work!,
  });

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
          const { posts: pf, fetched } = await getPosts(lang,o);
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
    return work?.ratingCount??0;
  };

  const getRatingAvg = () => {
    if (work) {
      return work.ratingAVG || 0;
    }
    return 0;
  };

  

  return (
    // <WorkContext.Provider value={{ work, linkToWork: false }}>
      <MosaicContext.Provider value={{ showShare: true }}>
        

        {
          //  (!editPostOnSmallerScreen.value)
          //   ?
          <Stack gap={6}>
            <Suspense fallback={<CircularProgress/>}>
              {post == null ? (
              <>
              
              <Grid container>
                <Grid item md={4}>
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
                <Grid item md={8}>
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
                          color='warning'
                          title={t('common:clearRating')}
                          // className="text-warning p-0 ms-2"
                          onClick={clearRating}
                          // variant="link"
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
                    <HyvorComments entity="work" id={`${work.id}`} session={session} />
                  </Stack>
                </Grid>
              </Grid>
             
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
                    <TabPanel items={[
                      {
                        label:<Typography>{t('tabHeaderPosts')} ({dataPosts?.total})</Typography>,
                        content: posts 
                          ? <TabPosts workId={workId} posts={posts} cacheKey={['POSTS', JSON.stringify(workPostsWhere)]} />
                          : <></>
                      },
                      {
                        label:<Typography>{t('tabHeaderCycles')} ({cyclesCount})</Typography>,
                        content:cycles?.length 
                          ? <TabCycles workId={workId} cycles={cycles}/>
                          : <></>
                      }
                    ]}>
                    </TabPanel>
                    
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
    // </WorkContext.Provider >
  );
};

export default WorkDetailComponent;
