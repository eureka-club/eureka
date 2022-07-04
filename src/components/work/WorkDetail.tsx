import { FunctionComponent, MouseEvent, useEffect, useState, lazy, Suspense } from 'react';
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
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { PostMosaicItem } from '@/src/types/post';
import UnclampText from '@/components/UnclampText';
import WorkSummary from './WorkSummary';
import detailPagesAtom from '@/src/atoms/detailPages';
import globalModalsAtom from '@/src/atoms/globalModals';
import editOnSmallerScreens from '../../atoms/editOnSmallerScreens';
import styles from './WorkDetail.module.css';
import TagsInput from '@/components/forms/controls/TagsInput';
import MosaicItem from './MosaicItem';
import { MosaicContext } from '@/src/useMosaicContext';
import { WorkContext } from '@/src/useWorkContext';
import EditPostForm from '@/components/forms/EditPostForm';
import useWork from '@/src/useWork'
import useCycles from '@/src/useCycles'
import usePosts,{getPosts} from '@/src/usePosts'
import ListWindow from '@/components/ListWindow'
import WorkDetailPost from './WorkDetailPost';

import MosaicItemPost from '@/components/post/MosaicItem'
import { useInView } from 'react-intersection-observer';

const PostDetailComponent = lazy(()=>import('@/components/post/PostDetail')) ;
 
interface Props {
  workId: number;
  post?: PostMosaicItem;
}

const WorkDetailComponent: FunctionComponent<Props> = ({ workId, post }) => {
  const router = useRouter();
  const [detailPagesState, setDetailPagesState] = useAtom(detailPagesAtom);
  const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  const { t } = useTranslation('workDetail');
  const [editPostOnSmallerScreen,setEditPostOnSmallerScreen] = useAtom(editOnSmallerScreens);
  const {data:session} = useSession();
  const [ref, inView] = useInView({
    triggerOnce: false,
    // rootMargin: '200px 0px',
    // skip: supportsLazyLoading !== false,
  });

  const {data:work} = useWork(workId,{
    enabled:!!workId
  })

  const workCyclessWhere = {
    where:{works:{
      some:{
        id:workId
      }
    }}
  }
  const [workPostsWhere,setWorkPostsWhere] = useState<Record<string,any>>(
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
  const {data:dataPosts} = usePosts({props:workPostsWhere},{enabled:!!workId})//OJO this trigger just once -load the same data that page does
  const [posts,setPosts] = useState(dataPosts?.posts)
  const [cycles,setCycles] = useState(dataCycles?.cycles)

  const [hasMorePosts,setHasMorePosts] = useState(dataPosts?.fetched);
  useEffect(()=>{
    if(dataPosts && dataPosts.posts){
      setHasMorePosts(dataPosts.fetched)
      setPosts(dataPosts.posts)
    }
  },[dataPosts])

  useEffect(()=>{
    if(dataCycles && dataCycles.cycles){
      setCycles(dataCycles.cycles)
    }
  },[dataCycles])


  useEffect(()=>{
    if(inView && hasMorePosts){
      if(posts){
        const loadMore = async ()=>{
          const {id} = posts.slice(-1)[0];
          const o = {...workPostsWhere,skip:1,cursor:{id}};
          const {posts:pf,fetched} = await getPosts({props:o})
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
      setDetailPagesState({ ...detailPagesState, selectedSubsectionWork: key });
    }
  };

  const handleEditClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    setGlobalModalsState({ ...globalModalsState, ...{ editWorkModalOpened: true } });
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
    setGlobalModalsState({ ...globalModalsState, ...{ editPostModalOpened: true } });
  };

  const handleEditPostOnSmallerScreen = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
        setEditPostOnSmallerScreen({ ...editOnSmallerScreens, ...{ value: !editPostOnSmallerScreen.value } });
  };

  const renderPosts = ()=>{
    if(posts){
      return <>
        <WorkDetailPost workId={work.id} className='mb-2' cacheKey={['POSTS',JSON.stringify(workPostsWhere)]}></WorkDetailPost> 
        {/* <div className='d-none d-md-block'><ListWindow items={posts} cacheKey={['POSTS',JSON.stringify(workPostsWhere)]} itemsByRow={4} /></div>
        <div className='d-block d-md-none'><ListWindow items={posts} cacheKey={['POSTS',JSON.stringify(workPostsWhere)]} itemsByRow={1} /></div> */}
        <Row>
        {posts.map((p)=><Col key={p.id} className="mb-5">
          <MosaicItemPost  cacheKey={['POST',`${p.id}`]} postId={p.id} />          
        </Col>
        )}
        </Row>
        <div className="mt-5" ref={ref}>
          {renderSpinnerForLoadNextCarousel()}
        </div>
      </>
    }
    return '';
  }

  return (
    <WorkContext.Provider value={{ work, linkToWork: false }}>
      <MosaicContext.Provider value={{ showShare: true }}>
       
       {(!editPostOnSmallerScreen.value) ? 
        <ButtonGroup className="mt-1 mt-md-3 mb-1">
          <Button variant="primary text-white" onClick={() => router.back()} size="sm">
            <BiArrowBack />
          </Button>
          {!router.query.postId && canEditWork() && (
            <Button variant="warning" onClick={handleEditClick} size="sm">
              {t('edit')}
            </Button>
          )}
          {post && work && canEditPost() && (<>
          <Button className='d-none d-md-block' variant="warning" onClick={handleEditPostClick} size="sm">
            {t('edit')}
          </Button>
            <Button className='d-block d-md-none' variant="warning" onClick={handleEditPostOnSmallerScreen} size="sm">
            {t('edit')}
          </Button></>
          )}
        </ButtonGroup> :
        
        <ButtonGroup className="mt-1 mt-md-3 mb-1">
        <Button variant="primary text-white" onClick={handleEditPostOnSmallerScreen} size="sm">
          <BiArrowBack />
        </Button>
      </ButtonGroup>
      }

     {(!editPostOnSmallerScreen.value) 
      ? <>
          <Suspense fallback={<Spinner animation="grow"/>}>
            {post == null ? (
              <Row className="mb-5 d-flex flex-column flex-md-row">
                <Col className='col-md-5 col-lg-4 col-xl-3   d-none d-md-block'>
                  <MosaicItem workId={work.id} showTrash linkToWork={false} />

                  {/* <div className={classNames(styles.imgWrapper, 'mb-3')}>
                  <LocalImageComponent filePath={work.localImages[0].storedFile} alt={work.title} />
                </div>
                <SocialInteraction cacheKey={['WORKS', `${work.id}`]} entity={work} showCounts showShare showTrash /> */}
                </Col>
                <Col className='col-md-7 col-lg-8 col-xl-9'>
                  <section className="mx-md-4">
                    <h1 className="fw-bold text-secondary">{work.title}</h1>
                    <h2 className={styles.author}>{work.author}</h2>
                    <WorkSummary work={work} />
                    <div className='d-flex flex-row'>
                      {work.topics && <TagsInput formatValue={(v: string) => t(`topics:${v}`)} tags={work.topics} readOnly label="" />}
                      {work.tags && <TagsInput tags={work.tags} readOnly label="" />}
                    </div>
                    {work.link != null && (
                      <a href={work.link} className={classNames(styles.workLink,'mb-5')} target="_blank" rel="noreferrer">
                        {t('workLinkLabel')} <BsBoxArrowUpRight />
                      </a>
                    )}
                  
                  <div className='container d-sm-block d-md-none mt-4 mb-4 position-relative'>
                    <MosaicItem className='postition-absolute start-50 translate-middle-x'  workId={work.id} showTrash linkToWork={false} />
                  </div>
                  {work.contentText != null && <UnclampText isHTML={false} text={work.contentText} clampHeight="8rem" />}
                  </section>
                {/* <div className='container d-none d-lg-block mt-5'>
                  <CommentsList entity={work} parent={undefined}/>
                </div> */}
          </Col>
            {/* <div className='container d-sm-block d-lg-none mt-3'>
                  <CommentsList entity={work} parent={undefined}/>
            </div> */}
              </Row>
            ) : (
              <>{post && work && <PostDetailComponent postId={post.id} work={work} cacheKey={['POST',`${post.id}`]} />}</>
            )}
          </Suspense>

          {post == null && (
            <Row className="mb-5">
              <Col>
                {detailPagesState.selectedSubsectionWork != null && (
                  <TabContainer
                    defaultActiveKey={'posts'}
                    onSelect={handleSubsectionChange}
                    transition={true}
                  >
                  
                    <style jsx global>
                      {`
                        .nav-tabs .nav-item.show .nav-link,
                        .nav-tabs .nav-link.active,
                        .nav-tabs .nav-link:hover {cursor:pointer;
                          background-color: var(--bs-primary);
                          color: white!important;
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
                      <div className=''>
                        <Nav variant="tabs" className='scrollNav' fill>
                          {/* <NavItem>
                            <NavLink eventKey="all">
                              {t('tabHeaderAll')} ({cyclesCount+postsCount})
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
                          {/* <TabPane eventKey="all">
                            {all && <>
                            <div className='d-none d-md-block'><ListWindow items={all} cacheKey={['WORK',`${work.id}-ALL`]} itemsByRow={4} /></div>
                            <div className='d-block d-md-none'><ListWindow items={all} cacheKey={['WORK',`${work.id}-ALL`]} itemsByRow={1} /></div>
                            </>}
                          </TabPane> */}
                          <TabPane eventKey="posts">{
                            renderPosts()
                          }
                          </TabPane>
                          <TabPane eventKey="cycles">
                            {cycles && <>
                                <div className='d-none d-md-block'><ListWindow items={cycles} cacheKey={['CYCLES',JSON.stringify(workCyclessWhere)]} itemsByRow={4} /></div>
                                <div className='d-block d-md-none'><ListWindow items={cycles} cacheKey={['CYCLES',JSON.stringify(workCyclessWhere)]} itemsByRow={1} /></div>
                                </> }
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
      : <EditPostForm noModal cacheKey={['POSTS',JSON.stringify(workPostsWhere)]} />}
      </MosaicContext.Provider>
    </WorkContext.Provider>
  );
};

export default WorkDetailComponent;
