import { FunctionComponent, MouseEvent, useEffect, useState, lazy, Suspense, useCallback } from 'react';
import classNames from 'classnames';
import { useAtom } from 'jotai';
import useTranslation from 'next-translate/useTranslation';

import {
  Nav,
  NavItem,
  TabPane,
  TabContent,
  TabContainer,
  Row,
  Col,
  NavLink,
  Button,
  ButtonGroup, 
  Spinner,
} from 'react-bootstrap';
import { BsBoxArrowUpRight } from 'react-icons/bs';
import { BiArrowBack } from 'react-icons/bi';
// import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { PostMosaicItem } from '@/src/types/post';
import UnclampText from '@/components/UnclampText';
import WorkSummary from './WorkSummary';
import detailPagesAtom from '@/src/atoms/detailPages';
//import globalModalsAtom from '@/src/atoms/globalModals';
// import editOnSmallerScreens from '../../atoms/editOnSmallerScreens';
import styles from './WorkDetail.module.css';
import TagsInput from '@/components/forms/controls/TagsInput';
import MosaicItem from './MosaicItem';
import { MosaicContext } from '@/src/useMosaicContext';
import { WorkContext } from '@/src/useWorkContext';
import useWork from '@/src/useWork'
import useCycles from '@/src/useCycles'
import usePosts,{getPosts} from '@/src/usePosts'
import WorkDetailPost from './WorkDetailPost';
import CMI from '@/src/components/cycle/MosaicItem'
import MosaicItemPost from '@/src/components/post/MosaicItem'
import { useInView } from 'react-intersection-observer';
import { Session } from '@/src/types';
import HyvorComments from '@/src/components/common/HyvorComments';
import useExecRatingWork from '@/src/hooks/mutations/useExecRatingWork';
import Rating from '../common/Rating';
import { Box } from '@mui/material';

const PostDetailComponent = lazy(()=>import('@/components/post/PostDetail')) ;
 
interface Props {
  workId: number;
  post?: PostMosaicItem;
  session:Session
}

const WorkDetailComponent: FunctionComponent<Props> = ({ workId, post,session }) => {
  const router = useRouter();
  const [detailPagesState, setDetailPagesState] = useAtom(detailPagesAtom);
  //const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  const { t } = useTranslation('workDetail');
  //const [editPostOnSmallerScreen,setEditPostOnSmallerScreen] = useAtom(editOnSmallerScreens);
  const [ref, inView] = useInView({
    triggerOnce: false,
    // rootMargin: '200px 0px',
    // skip: supportsLazyLoading !== false,
  });

  const {data:work} = useWork(workId,{
    enabled:!!(workId) 
  });

  const [qty, setQty] = useState(work?.ratingAVG||0);
  const [qtyByUser,setqtyByUser] = useState(0);

  useEffect(()=>{
    if(work && session){
      let ratingCount = work.ratings.length;
      const ratingAVG = work.ratings.reduce((p,c)=>c.qty+p,0)/ratingCount;
      setQty(ratingAVG);

      const currentRating = work?.ratings.filter(w=>w.userId==session?.user.id);
      setqtyByUser(currentRating?.length ? currentRating[0].qty : 0);
    }

  },[work,session])
  
  const workCyclessWhere = {
    where:{works:{
      some:{
        id:workId
      }
    }}
  }
  const [workPostsWhere] = useState<Record<string,any>>(
    {
      take:8,
      where:{
        works:{
          some:{
            id:workId
          }
        }
      }
    }
  )
  const {data:dataCycles} = useCycles(workCyclessWhere,{enabled:!!workId})
  const {data:dataPosts} = usePosts(workPostsWhere,{enabled:!!workId})//OJO this trigger just once -load the same data that page does
  const [posts,setPosts] = useState(dataPosts?.posts)
  const [cycles,setCycles] = useState(dataCycles?.cycles)
  const [defaultActiveKey,setDefaultActiveKey] = useState<string>('posts')

  const [hasMorePosts,setHasMorePosts] = useState(dataPosts?.fetched);

  const {mutate:execRating} = useExecRatingWork({
    work:work!,
  });

  useEffect(()=>{
    if(dataPosts && dataPosts.posts){
      setHasMorePosts(dataPosts.fetched)
      setPosts(dataPosts.posts)
      if(dataPosts.posts.length)setDefaultActiveKey('posts')
    }
  },[dataPosts])

  useEffect(()=>{
    if(dataCycles && dataCycles.cycles){
      setCycles(dataCycles.cycles)
      if(dataCycles.cycles.length && !posts?.length)setDefaultActiveKey('cycles')
    }
    if(router.query.tabKey)setDefaultActiveKey(router.query.tabKey.toString())

  },[dataCycles,posts])

  useEffect(()=>{
    if(inView && hasMorePosts){
      if(posts){
        const loadMore = async ()=>{
          const {id} = posts.slice(-1)[0];
          const o = {...workPostsWhere,skip:1,cursor:{id}};
          const {posts:pf,fetched} = await getPosts(o)
          setHasMorePosts(fetched);
          const posts_ = [...(posts||[]),...pf];
          setPosts(posts_);
        }
        loadMore();
      }
    }
  },[inView]);
  

  let cyclesCount = 0;
  if(cycles)cyclesCount = cycles.length
  
  if(!work)return <></>
  
  const renderSpinnerForLoadNextCarousel = ()=>{
    if(hasMorePosts) return <Spinner animation="grow" />
            return '';
  }

  const handleSubsectionChange = (key: string | null) => {
    if (key != null) {
      setDefaultActiveKey(key)
      setDetailPagesState({ ...detailPagesState, selectedSubsectionWork: key });
    }
  };

  const handleEditClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    localStorage.setItem('redirect',`/work/${work.id}`)
    router.push(`/work/${work.id}/edit`)
  };

  const canEditWork = (): boolean => {
    if (session && session.user.roles === 'admin') return true;
    return false;
  };

  const canEditPost = (): boolean => {
    if (session && post && session.user.id === post.creatorId) return true;
    return false;
  };

  const handleEditPostClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    if(post){
      localStorage.setItem('redirect',`/work/${work.id}`)
      router.push(`/post/${post.id}/edit`)
    }
  };

  /*const handleEditPostOnSmallerScreen = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
        setEditPostOnSmallerScreen({ ...editOnSmallerScreens, ...{ value: !editPostOnSmallerScreen.value } });
  };*/

  const renderPosts = ()=>{
    if(posts){
      return <>
        <WorkDetailPost workId={work.id} className='mb-2' cacheKey={['POSTS',JSON.stringify(workPostsWhere)]}></WorkDetailPost> 
        <Row className='mt-5'>
        {posts.map((p)=><Col key={p.id} xs={12} sm={6} lg={3} xxl={2} className="mb-5 d-flex justify-content-center  align-items-center">
          <MosaicItemPost  cacheKey={['POST',`${p.id}`]} postId={p.id} size={'md'} showSaveForLater={true}  />          
        </Col>
        )}
        </Row>
        <div className="mt-5" ref={ref}>
          {hasMorePosts ? <Spinner animation="grow" />
            :<></>}
        </div>
      </>
    }
    return '';
  }

  const renderCycles =()=>{
    if(cycles){
      return <Row className='mt-5'>
        {cycles.map(c=><Col xs={12} sm={6} lg={3} xxl={2} className="mb-5 d-flex justify-content-center  align-items-center" key={c.id}>
          <CMI cycleId={c.id} cacheKey={['CYCLES',`WORK-${workId}`]} size={'md'} showSaveForLater={true}  /></Col>)}
      </Row>
    }
    return <></> 
  }

  

  const handlerChangeRating = (value: number) => {
    setQty(value);
    setqtyByUser(value);
    execRating({
      ratingQty: value,
      doCreate: value ? true : false,
    });
  };

  return (
    <WorkContext.Provider value={{ work, linkToWork: false }}>
      <MosaicContext.Provider value={{ showShare: true }}>
        <ButtonGroup className="mt-1 mt-md-3 mb-1">
          <Button variant="primary text-white" onClick={() => router.back()} size="sm">
            <BiArrowBack />
          </Button>
          {!router.query.postId && canEditWork() && (
            <Button variant="warning" onClick={handleEditClick} size="sm">
              {t('edit')}
            </Button>
          )}
          {post && work && canEditPost() && (
            <>
              <Button variant="warning" onClick={handleEditPostClick} size="sm">
                {t('edit')}
              </Button>
            </>
          )}
        </ButtonGroup>

        {
          //  (!editPostOnSmallerScreen.value)
          //   ?
          <>
            <Suspense fallback={<Spinner animation="grow" />}>
              {post == null ? (
                <Row className="mb-5 d-flex flex-column flex-md-row">
                  <Col className="col-md-5 col-lg-4 col-xl-3   d-none d-md-block">
                    <MosaicItem
                      workId={work.id}
                      showTrash
                      linkToWork={false}
                      size={'lg'}
                      showCreateEureka = {false}
                      showSaveForLater={true}
                    />
                    <Box mt={1}>
                      <Rating
                        qty={qtyByUser}
                        onChange={handlerChangeRating}
                        size="medium"
                        iconColor="var(--bs-danger)"

                      />
                    </Box>
                    {/* <div className={classNames(styles.imgWrapper, 'mb-3')}>
                  <LocalImageComponent filePath={work.localImages[0].storedFile} alt={work.title} />
                </div>
                <SocialInteraction cacheKey={['WORKS', `${work.id}`]} entity={work} showCounts showShare showTrash /> */}
                  </Col>
                  <Col className="col-md-7 col-lg-8 col-xl-9">
                    <section className="mx-md-4">
                      <h1 className="fw-bold text-secondary">{work.title}</h1>
                      <h2 className={styles.author}>{work.author}</h2>
                      <WorkSummary work={work} />
                      <div className="d-flex flex-wrap flex-row">
                        {work.topics && (
                          <TagsInput
                            className="d-flex flex-row"
                            formatValue={(v: string) => t(`topics:${v}`)}
                            tags={work.topics}
                            readOnly
                          />
                        )}
                        {work.tags && <TagsInput className="d-flex flex-row" tags={work.tags} readOnly />}
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
                      <div className="container d-sm-block d-md-none mt-4 mb-4 position-relative">
                        <MosaicItem
                          className="postition-absolute start-50 translate-middle-x"
                          work={work}
                          workId={work.id}
                          showTrash
                          linkToWork={false}
                          size={'lg'}
                          showSaveForLater={true}
                        />
                      </div>
                      <Box mt={1}>
                        <Rating
                          qty={qty}
                          onChange={handlerChangeRating}
                          size="medium"
                          readonly
                          
                        />
                      </Box>
                      {work.contentText != null && (
                        <UnclampText isHTML={false} text={work.contentText} clampHeight="8rem" />
                      )}
                      {/* <HyvorComments entity='work' id={`${work.id}`}  /> */}
                    </section>
                    {/* <div className='container d-none d-lg-block mt-5'>
                  <CommentsList entity={work} parent={undefined}/>
                </div>*/}
                    <HyvorComments entity="work" id={`${work.id}`} />
                  </Col>
                  {/* <div className='container d-sm-block d-lg-none mt-3'>
                  <CommentsList entity={work} parent={undefined}/>
            </div> */}
                </Row>
              ) : (
                <>
                  {post && work && (
                    <PostDetailComponent
                      showSaveForLater={true}
                      postId={post.id}
                      work={work}
                      cacheKey={['POST', `${post.id}`]}
                    />
                  )}
                </>
              )}
            </Suspense>

            {post == null && (
              <Row className="mb-5">
                <Col>
                  {detailPagesState.selectedSubsectionWork != null && (
                    <TabContainer
                      // defaultActiveKey={defaultActiveKey}
                      activeKey={defaultActiveKey}
                      onSelect={handleSubsectionChange}
                      transition={true}
                    >
                      <style jsx global>
                        {`
                          .nav-tabs .nav-item.show .nav-link,
                          .nav-tabs .nav-link.active,
                          .nav-tabs .nav-link:hover {
                            cursor: pointer;
                            background-color: var(--bs-primary);
                            color: white !important;
                            border: none !important;
                            border-bottom: solid 2px var(--bs-primary) !important;
                          }
                          .nav-tabs {
                            border-bottom: solid 1px var(--bs-primary) !important;
                          }
                        `}
                      </style>
                      <Row className="mb-4">
                        <Col>
                          <div className="">
                            <Nav variant="tabs" className="scrollNav" fill>
                              {/*<NavItem>
                            <NavLink eventKey="discussion">
                              {t('discussion')}
                            </NavLink>
                          </NavItem> */}
                              <NavItem>
                                <NavLink eventKey="posts" data-cy="posts">
                                  {t('tabHeaderPosts')} ({dataPosts?.total})
                                </NavLink>
                              </NavItem>
                              <NavItem>
                                <NavLink eventKey="cycles">
                                  {t('tabHeaderCycles')} ({cyclesCount})
                                </NavLink>
                              </NavItem>
                            </Nav>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <TabContent>
                            {/*<TabPane eventKey="discussion"> 
                            <HyvorComments entity='work' id={`${work.id}`}  />
                          </TabPane>*/}
                            <TabPane eventKey="posts">
                              {posts ? (
                                <>
                                  <WorkDetailPost
                                    workId={work.id}
                                    className="mb-2"
                                    cacheKey={['POSTS', JSON.stringify(workPostsWhere)]}
                                  ></WorkDetailPost>
                                  <Row className="mt-5">
                                    {posts.map((p) => (
                                      <Col
                                        key={p.id}
                                        xs={12}
                                        sm={6}
                                        lg={3}
                                        xxl={2}
                                        className="mb-5 d-flex justify-content-center  align-items-center"
                                      >
                                        <MosaicItemPost
                                          cacheKey={['POST', `${p.id}`]}
                                          postId={p.id}
                                          size={'md'}
                                          showSaveForLater={false}
                                        />
                                        
                                      </Col>
                                    ))}
                                  </Row>
                                  {/* TODO this make rerender the hyvor talk but is needed <div className="mt-5" ref={ref}>
                                  {hasMorePosts ? <Spinner animation="grow" />
                                  :<></>}
                                </div> */}
                                </>
                              ) : (
                                <></>
                              )}
                            </TabPane>
                            <TabPane eventKey="cycles">
                              {cycles ? (
                                <Row className="mt-5">
                                  {cycles.map((c) => (
                                    <Col
                                      xs={12}
                                      sm={6}
                                      lg={3}
                                      xxl={2}
                                      className="mb-5 d-flex justify-content-center  align-items-center"
                                      key={c.id}
                                    >
                                      <CMI
                                        cycleId={c.id}
                                        cacheKey={['CYCLES', `WORK-${workId}`]}
                                        size={'md'}
                                        showSaveForLater={false}
                                      />
                                    </Col>
                                  ))}
                                </Row>
                              ) : (
                                <></>
                              )}
                            </TabPane>
                          </TabContent>
                        </Col>
                      </Row>
                    </TabContainer>
                  )}
                </Col>
              </Row>
            )}
          </>
          // : <EditPostForm noModal cacheKey={['POSTS',JSON.stringify(workPostsWhere)]} />
        }
      </MosaicContext.Provider>
    </WorkContext.Provider>
  );
};

export default WorkDetailComponent;
