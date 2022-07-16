import dayjs from 'dayjs';
import { useAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, MouseEvent, useState, useRef, useEffect, Suspense, lazy } from 'react';
import {
  TabPane,
  TabContent,
  TabContainer,
  Row,
  Col,
  ButtonGroup,
  Button,
  Nav,
  NavItem,
  NavLink,
  Spinner,
} from 'react-bootstrap';
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';
import { BiArrowBack } from 'react-icons/bi';
import { MosaicContext } from '@/src/useMosaicContext';
import { useQueryClient } from 'react-query';

import { ASSETS_BASE_URL, DATE_FORMAT_SHORT_MONTH_YEAR /* , HYVOR_WEBSITE_ID, WEBAPP_URL */ } from '@/src/constants';
import { PostMosaicItem } from '@/src/types/post';
import { WorkMosaicItem } from '@/src/types/work';

import PostDetailComponent from '../post/PostDetail';
import HyvorComments from '@/src/components/common/HyvorComments';
import detailPagesAtom from '@/src/atoms/detailPages';
import globalModalsAtom from '@/src/atoms/globalModals';
import editOnSmallerScreens from '@/src/atoms/editOnSmallerScreens';

import styles from './CycleDetail.module.css';
import { useCycleContext } from '@/src/useCycleContext';
import CycleDetailHeader from './CycleDetailHeader';
import useCycle from '@/src/useCycle';
import useWorks from '@/src/useWorks'
import usePosts,{getPosts} from '@/src/usePosts'
import useUsers from '@/src/useUsers'
import MosaicItemPost from '@/components/post/MosaicItem'
import MosaicItemUser from '@/components/user/MosaicItem'
import { useInView } from 'react-intersection-observer';


const CycleDetailDiscussion = lazy(() => import ('./CycleDetailDiscussion')) 
const CycleDetailParticipants = lazy(() => import('./CycleDetailParticipants'))
const CycleDetailWorks = lazy(() => import('./CycleDetailWorks'))
// const CycleDetailPosts = lazy(() => import('./CycleDetailPosts'))
interface Props {
  post?: PostMosaicItem;
  work?: WorkMosaicItem;
}

const CycleDetailComponent: FunctionComponent<Props> = ({
  post,
  work,
}) => {
  const cycleContext = useCycleContext();
  const router = useRouter();
  
  const queryClient = useQueryClient()
  const [tabKey, setTabKey] = useState<string>();

  const [ref, inView] = useInView({
    triggerOnce: false,
  });


  const [cycleId,setCycleId] = useState<string>('')
  useEffect(()=>{
    if(router?.query){
      if(router.query.id){
        setCycleId(router.query.id?.toString())
      }
      if(router.query.tabKey)setTabKey(router.query.tabKey.toString())
    }
  },[router])

  const {data:cycle,isLoading} = useCycle(+cycleId,{
    enabled:!!cycleId
  });

  const { data: dataWorks } = useWorks({where:{cycles: { some: { id: cycle?.id } } }}, {
    enabled:!!cycle?.id
  })
  const [works,setWorks] = useState(dataWorks?.works)

  useEffect(()=>{
    if(dataWorks && dataWorks.works){
      setWorks(dataWorks.works)
    }
  },[dataWorks])

  const whereCycleParticipants = {
    where:{OR:[
      {cycles: { some: { id: cycle?.id } }},//creator
      {joinedCycles: { some: { id: cycle?.id } }},//participants
    ]} 
  };
  const { data: participants,isLoading:isLoadingParticipants } = useUsers(whereCycleParticipants,
    {
      enabled:!!cycle?.id,
      from:'CycleDetail'
    }
  )

  useEffect(() => {
    if (cycle) {
      if (cycle.cycleWorksDates) { 
        cycle.cycleWorksDates.forEach(w => {
          queryClient.setQueryData(['WORK',`${w.id}`],w)
        })        
      }
      if(participants){
        participants.forEach(u => {
          queryClient.setQueryData(['USER',`${u.id}`],u)
        })
      }
    }
  },[cycle,queryClient])

  // useEffect(() => {
  //   if (works) {      
  //     if (works) { 
  //       works.forEach(w => {
  //         queryClient.setQueryData(['WORK',`${w.id}`],w)
  //       })        
  //     }
  //   }
  // },[queryClient,works])

  const cyclePostsProps = {take:8,where:{cycles:{some:{id:+cycleId}}}}
  const {data:dataPosts} = usePosts(cyclePostsProps,{enabled:!!cycleId})
  const [posts,setPosts] = useState(dataPosts?.posts)
  const [hasMorePosts,setHasMorePosts] = useState(dataPosts?.fetched);


  useEffect(()=>{
    if(dataPosts && dataPosts.posts){
      setHasMorePosts(dataPosts.fetched)
      setPosts(dataPosts.posts)
    }
  },[dataPosts])


  useEffect(()=>{
    if(inView && hasMorePosts){
      if(posts){
        const loadMore = async ()=>{
          const {id} = posts.slice(-1)[0];
          const o = {...cyclePostsProps,skip:1,cursor:{id}};
          const {posts:pf,fetched} = await getPosts(o)
          setHasMorePosts(fetched);
          const posts_ = [...(posts||[]),...pf];
          setPosts(posts_);
        }
        loadMore();
      }
    }
  },[inView]);
  


  const [detailPagesState, setDetailPagesState] = useAtom(detailPagesAtom);
  const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  const [editPostOnSmallerScreen,setEditPostOnSmallerScreen] = useAtom(editOnSmallerScreens);
  
  const {data:session, status} = useSession();
  const { t } = useTranslation('cycleDetail');
  
  const tabContainnerRef = useRef<HTMLDivElement>(null);
  const [filtersContentType, setFiltersContentType] = useState<string[]>([]);
  const [gldView, setgldView] = useState<Record<string, boolean>>({});
    
  if(!cycle)return <></>

  const renderSpinnerForLoadNextCarousel = ()=>{
    if(hasMorePosts) return <Spinner animation="grow" />
            return '';
  }

  const renderPosts = ()=>{
    if(posts){
      return <>
        <Row>
        {posts.map((p)=><Col xs={12} sm={6} lg={3} key={p.id} className="mb-5">
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

  const handleSubsectionChange = (key: string | null) => {
    if (key != null) {
      setTabKey(key);

      setDetailPagesState({ ...detailPagesState, selectedSubsectionCycle: key });
    }
  };

  const onCarouselSeeAllAction = async () => {
    setTabKey('cycle-about');
    if (tabContainnerRef)
      tabContainnerRef.current!.scrollIntoView({
        behavior: 'smooth',
      });
  };

  const onParticipantsAction = async () => {
    setTabKey('participants');
    if (tabContainnerRef)
      tabContainnerRef.current!.scrollIntoView({
        behavior: 'smooth',
      });
  };

  const handleEditClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    router.push(`/cycle/${router.query.id}/edit`);
  };

   const handleEditPostOnSmallerScreen = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
        setEditPostOnSmallerScreen({ ...editOnSmallerScreens, ...{ value: !editPostOnSmallerScreen.value } });
  };

  const canEditPost = (): boolean => {
    if (session && post && session.user.id === post.creatorId) return true;
    return false;
  };

  const canEditCycle = (): boolean => {
    if (session && cycle) {
      if (session.user.roles === 'admin' || session!.user.id === cycle.creatorId) return true;
    }
    return false;
  };  
  
  const renderCycleDetailHeader = () => {
    if (cycle) {
      const res = (
        <CycleDetailHeader
          cycleId={cycle.id}
          onParticipantsAction={onParticipantsAction}
          onCarouselSeeAllAction={onCarouselSeeAllAction}
        />
      );
      if (cycle.access === 3) return '';
      if (cycle.access === 1) return res;
      if (cycle.access === 2) return res;
    }
    return '';
  };
  
  const toggleGuidelineDesc = (key: string) => {
    if (key in gldView) {
      setgldView((res) => {
        return { ...res, [`${key}`]: !res[key] };
      });
    } else setgldView((res) => ({ ...res, [`${key}`]: true }));
  };

  const renderGuidelines = () => {
    if (cycle) {
      const glc = Math.ceil(cycle.guidelines.length / 2);
      const gll = cycle.guidelines.slice(0, glc);
      const glr = cycle.guidelines.slice(glc);
      let IDX = 0;
      const renderLI = (g: { title: string; contentText: string | null }, idx: number, gl: string) => {
        const key = `${gl}!${g.title}${idx + 1}`;
        IDX += 1;
        return (
          <aside key={key} className="mb-3 bg-light">
            <h5 className="h6 fw-bold mb-0 ps-3 py-1 d-flex text-secondary">
              <span className="py-1 fw-bold">{`${IDX}. `}</span>
              <span className="py-1 fw-bold h6 mb-0 ps-3 d-flex">{`${g.title}`}</span>
              <Button className="ms-auto text-white" size="sm" onClick={() => toggleGuidelineDesc(key)}>
                {!gldView[key] ? <RiArrowDownSLine /> : <RiArrowUpSLine />}
              </Button>
            </h5>
            {gldView[key] && <p className="px-3 pt-0 pb-3">{g.contentText}</p>}
          </aside>
        );
      };

      return (
        <Row>
          {gll.length && (
            <Col xs={12} md={6}>
              <section className="">{gll.map((g, idx) => renderLI(g, idx, 'gll'))}</section>
            </Col>
          )||''}
          {glr.length && (
            <Col>
              <section className="">{glr.map((g, idx) => renderLI(g, idx, 'glr'))}</section>
            </Col>
          )||''}
        </Row>
      );
    }
    return '';
  };
  const renderParticipants = ()=>{
    if(participants){
      return <Row>
        {participants.map(p=><Col xs={12} sm={4} lg={3} key={p.id}><MosaicItemUser user={p} /></Col>)}
      </Row>
    }
    return ''
  }
  const renderRestrictTabs = () => {
    if (cycle) {
      const res = (
        <Suspense fallback={<Spinner animation="grow"/>}>
          <TabPane eventKey="cycle-discussion">
              <HyvorComments entity='cycle' id={`${cycle.id}`}  />
          </TabPane>
          <TabPane eventKey="eurekas">
              <CycleDetailDiscussion cycle={cycle} className="mb-5" cacheKey={['POSTS',JSON.stringify(cyclePostsProps)]} />
              <Row>
                <Col /* xs={{span:12, order:'last'}} md={{span:9,order:'first'}} */>
                  <MosaicContext.Provider value={{ showShare: true }}>
                    {/* <CycleDetailPosts posts={posts||[]} cacheKey={['POSTS', JSON.stringify(cyclePostsProps)]}/> */}
                    {renderPosts()}
                  </MosaicContext.Provider>
                </Col>
              </Row> 
          </TabPane>
          <TabPane eventKey="guidelines">
            <section className="text-primary">
              <h4 className="h5 mt-4 mb-3 fw-bold text-gray-dark">{t('guidelinesMP')}</h4>
            </section>
            <section className=" pt-3">{cycle.guidelines && renderGuidelines()}</section>
          </TabPane>
          <TabPane eventKey="participants">
              {/* {participants && <CycleDetailParticipants participants={participants} cacheKey={['CYCLE',JSON.stringify(whereCycleParticipants)]} />}             */}
              {renderParticipants()}
          </TabPane>
        </Suspense>

        
      );
      if (cycle.access === 3) return '';
      if (cycle.access === 1) return res;
      if (cycle.access === 2 && (cycleContext.cycle?.currentUserIsCreator || cycleContext.cycle?.currentUserIsParticipant)) return res;
    }
    return '';
  };

  const renderRestrictTabsHeaders = () => {
    if (cycle && participants) {
      const res = (
        <>
          <NavItem className={`cursor-pointer ${styles.tabBtn}`}>
            <NavLink eventKey="cycle-discussion">
              <span className="mb-3">{t('Discussion')}</span>
            </NavLink>
          </NavItem>
          <NavItem className={`cursor-pointer ${styles.tabBtn}`}>
            <NavLink eventKey="eurekas">
              <span className="mb-3">{t('EurekaMoments')} ({dataPosts?.total})</span>
            </NavLink>
          </NavItem>
          {/* <NavItem className={`${styles.tabBtn}`}>
            <NavLink eventKey="my_milestone">{t('My milestones')}</NavLink>
          </NavItem> */}
          <NavItem className={`cursor-pointer ${styles.tabBtn}`}>
            <NavLink eventKey="guidelines">
              <span className="mb-3">{t('Guidelines')}</span>
            </NavLink>
          </NavItem>

          <NavItem className={`cursor-pointer ${styles.tabBtn}`}>
            <NavLink eventKey="participants">
              <span className="mb-3">{t('Participants')} ({participants.length})</span>
            </NavLink>
          </NavItem>
        </>
      );
      if (cycle.access === 3) return '';
      if (cycle.access === 1) return res;
      if (cycle.access === 2 && (cycleContext.cycle?.currentUserIsCreator || cycleContext.cycle?.currentUserIsParticipant)) return res;
    }
    return '';
  };

  const handleEditPostClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    if(post){
      localStorage.setItem('redirect',`/cycle/${cycle.id}`)
      router.push(`/post/${post.id}/edit`)
    }
  };

  const getDefaultActiveKey = () => {
    if (cycle) {
      if (cycle.access === 1) {
        if (cycleContext.currentUserIsParticipant) return 'cycle-discussion';
        return 'cycle-about';
      }
      if (cycle.access === 2 && (cycleContext.cycle?.currentUserIsCreator || cycleContext.cycle?.currentUserIsParticipant)) return 'cycle-discussion';
      if (cycle.access === 3 && cycleContext.currentUserIsParticipant) return 'cycle-discussion';
    }
    return 'cycle-about';
  };

  const removeCycle = async (e:MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if(cycle){
      const res = await fetch(`/api/cycle/${cycle.id}`,{
        method:'delete',
      });
      if(res.ok){
        const json = await res.json();
        return json;
      }
      else{
        setGlobalModalsState({
          ...globalModalsState,
          showToast: {
            show: true,
            type: 'warning',
            title: t(`common:${res.statusText}`),
            message: res.statusText,
          },
        });
      }
    }
    return null;
  };

  return (
    <>
    {(!editPostOnSmallerScreen.value) ? 
      <ButtonGroup className="mt-1 mt-md-3 mb-1">
        <Button variant="primary text-white" onClick={() => router.back()} size="sm">
          <BiArrowBack />
        </Button>
        
        {!router.query.postId && canEditCycle() && (
          <Button variant="warning" onClick={handleEditClick} size="sm">
            {t('Edit')}
          </Button>
        )}
       
        {/* <Button className="" variant="danger" onClick={e=>{removeCycle(e)}}>Remove Cycle</Button> */}

        {post && cycle && canEditPost() && (<>
          <Button variant="warning" onClick={handleEditPostClick} size="sm">
            {t('Edit')}
          </Button>
          {/* <Button className='d-block d-md-none' variant="warning" onClick={handleEditPostOnSmallerScreen} size="sm">
            {t('Edit')}
          </Button> */}
          </>
        )}
      </ButtonGroup> : 
    
      <ButtonGroup className="mt-1 mt-md-3 mb-1">
        <Button variant="primary text-white" onClick={handleEditPostOnSmallerScreen} size="sm">
          <BiArrowBack />
        </Button>
      </ButtonGroup>
     }

{
// (!editPostOnSmallerScreen.value) ? 
  <>
      {!post && renderCycleDetailHeader()}
      {post && cycle && (
        <MosaicContext.Provider value={{ showShare: true }}>
          <PostDetailComponent cacheKey={['CYCLE',cycle.id.toString()]} postId={post.id} work={work} />
        </MosaicContext.Provider>
      )}
      {cycle && post == null && (
        <Row className="mb-5" ref={tabContainnerRef}>
          <Col>
            {detailPagesState.selectedSubsectionCycle != null && (
              <TabContainer
                //defaultActiveKey={}
                onSelect={handleSubsectionChange}
                activeKey={tabKey || getDefaultActiveKey()}
                transition={false}
              >
                {/* language=CSS */}
                <style jsx global>
                  {`
                    .nav-tabs .nav-item.show .nav-link,
                    .nav-tabs .nav-link.active,
                    .nav-tabs .nav-link:hover {
                      background-color: var(--bs-primary);
                      color: white !important;
                      border: none !important;
                      border-bottom: solid 2px var(--bs-primary) !important;
                    }
                    .nav-tabs {
                      border: none !important;
                    }
                  `}
                </style>
                <Row className="mb-4">
                  <Col>
                    <Nav variant="tabs" className='scrollNav' fill>
                      <NavItem className={`border-primary border-bottom cursor-pointer ${styles.tabBtn}`}>
                        <NavLink eventKey="cycle-about">
                          <span className="mb-3">
                            {t('About')} ({works && works.length})
                          </span>
                        </NavLink>
                      </NavItem>
                      {renderRestrictTabsHeaders()}
                    </Nav>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <TabContent>
                      <TabPane eventKey="cycle-about">
                        <h5 className="mt-4 mb-3 fw-bold text-gray-dark">{t('Why does this cycle matter')}?</h5>
                        {cycle.contentText != null && (
                          <div className="">
                            <div
                              className={styles.dangerouslySetInnerHTML}
                              dangerouslySetInnerHTML={{ __html: cycle.contentText }}
                            />
                            {/* <UnclampText text={cycle.contentText} clampHeight="7rem" /> */}
                          </div>
                        )}
                        <MosaicContext.Provider value={{ showShare: true }}>                        
                          {cycle && works && <CycleDetailWorks works={works} cycleWorksDates={cycle.cycleWorksDates} /> || ''}
                        </MosaicContext.Provider>
                        {cycle.complementaryMaterials && cycle.complementaryMaterials.length > 0 && (
                          <Row className="mt-5 mb-5">
                            <Col className='col-12'>
                              <h5 className="mt-5 mb-3 fw-bold text-gray-dark">{t('complementaryMaterialsTitle')}</h5>
                              <ul className={styles.complementaryMaterials}>
                                {cycle.complementaryMaterials.map((cm) => (
                                  <li key={cm.id}>
                                    <a
                                      href={cm.link || `${ASSETS_BASE_URL}/${cm.storedFile}`}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      <h5>{cm.title}</h5>
                                      <p>
                                        {cm.author} ({dayjs(cm.publicationDate).format(DATE_FORMAT_SHORT_MONTH_YEAR)})
                                      </p>
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </Col>
                            <Col />
                          </Row>
                        )}
                      </TabPane>
                      {renderRestrictTabs()}
                    </TabContent>
                  </Col>
                </Row>
              </TabContainer>
            )}
          </Col>
        </Row>
      )
      }</> 
      // : <EditPostForm noModal />
      }
    </>
  );
};

export default CycleDetailComponent;
