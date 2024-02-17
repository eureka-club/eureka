import dayjs from 'dayjs';
import { useAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, MouseEvent, useState, useRef, useEffect, Suspense, lazy, FC } from 'react';
import {
  TabPane,
  TabContent,
  TabContainer,
  Row,
  Col,
  Button,
  ButtonGroup,
  Nav,
  NavItem,
  NavLink,
  Spinner,
} from 'react-bootstrap';
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';
import { MosaicContext } from '@/src/useMosaicContext';
import { useQueryClient } from 'react-query';
import { Button as MaterialButton } from '@mui/material';

import { ASSETS_BASE_URL, DATE_FORMAT_SHORT_MONTH_YEAR /* , HYVOR_WEBSITE_ID, WEBAPP_URL */ } from '@/src/constants';
import { PostDetail } from '@/src/types/post';
import { WorkDetail } from '@/src/types/work';

import PostDetailComponent from '../post/PostDetail';
import HyvorComments from '@/src/components/common/HyvorComments';
import detailPagesAtom from '@/src/atoms/detailPages';
import globalModalsAtom from '@/src/atoms/globalModals';

import styles from './CycleDetail.module.css';
import { useCycleContext } from '@/src/useCycleContext';
import CycleDetailHeader from './CycleDetailHeader';
import useCycle from '@/src/useCycle';
import usePosts,{getPosts} from '@/src/usePosts'
import useUsers from '@/src/useUsers'
import MosaicItemPost from '@/src/components/post/MosaicItem'
import MosaicItemUser from '@/components/user/MosaicItem'
import { useInView } from 'react-intersection-observer';
import { CycleDetail } from '@/src/types/cycle';
import { Session } from '@/src/types';
import { useCycleParticipants } from '@/src/hooks/useCycleParticipants';
import { CycleWork } from '@/src/types/cycleWork';


const CycleDetailDiscussion = lazy(() => import ('./CycleDetailDiscussion')) 
const CycleDetailWorks = lazy(() => import('./CycleDetailWorks'))
interface Props {
  post?: PostDetail;
  work?: WorkDetail;
  session:Session
}

const CycleDetailComponent: FunctionComponent<Props> = ({
  post,
  work,
  session
}) => {
  const {lang} = useTranslation();
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
  console.log("cycle ", cycle)

  const works = cycle?.cycleWorksDates?.length
    ? cycle?.cycleWorksDates
    : cycle?.works.map(w=>({id:w.id,workId:w.id,work:w,startDate:new Date(),endDate:new Date()}))

  const{data:participants}=useCycleParticipants(cycle?.id!,{enabled:!!cycle?.id!});

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
          const {posts:pf,fetched} = await getPosts(lang,o)
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
 // const [editPostOnSmallerScreen,setEditPostOnSmallerScreen] = useAtom(editOnSmallerScreens);
  
  //const {data:session, status} = useSession();
  const { t } = useTranslation('cycleDetail');
  
  const tabContainnerRef = useRef<HTMLDivElement>(null);
  const cycleWorksRef = useRef<HTMLDivElement>(null);
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
        <Row className='mt-2'>
        {posts.map((p)=><Col xs={12} sm={6} lg={3} xxl={2} key={p.id} className="mb-5 d-flex justify-content-center  align-items-center">
          <MosaicItemPost  cacheKey={['POST',`${p.id}`]} postId={p.id} showSaveForLater={false} size={'md'} />          
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
    if (cycleWorksRef)
      cycleWorksRef.current!.scrollIntoView({
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

  

   /*const handleEditPostOnSmallerScreen = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
        setEditPostOnSmallerScreen({ ...editOnSmallerScreens, ...{ value: !editPostOnSmallerScreen.value } });
  };*/

    
  
  const renderCycleDetailHeader = () => {
    if (cycle) {
      const res = (
        <CycleDetailHeader
          cycleId={cycle.id}
          onParticipantsAction={onParticipantsAction}
          onCarouselSeeAllAction={onCarouselSeeAllAction}
        />
      );
      const allowed = participants && participants.findIndex(p=>p.id==session?.user.id)>-1
        || cycle.creatorId == session?.user.id;
      if(allowed)return res;  
      else if([1,2,4].includes(cycle.access))return res;
      if (cycle.access === 3) return '';
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
              <MaterialButton 
                className="ms-auto text-white" 
                size="small" 
                onClick={() => toggleGuidelineDesc(key)}
                sx={{
                  backgroundColor:'var(--eureka-green)',
                  padding:'0',
                  ":hover":{
                  backgroundColor:'var(--color-primary-raised)',
                  }
              }}
              >
                {!gldView[key] ? <RiArrowDownSLine /> : <RiArrowUpSLine />}
              </MaterialButton>
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
      return <Row className='mt-3'>
        {
          participants.map(p=><Col xs={12} sm={4} lg={3} key={p.id} className="mb-3 d-flex justify-content-center  align-items-center">
            <MosaicItemUser user={p} /></Col>
          )
        }
      </Row>
    }
    return ''
  }
  const renderRestrictTabs = () => {
    if (cycle) {
      const res = (
        <Suspense fallback={<Spinner animation="grow"/>}>
          <TabPane eventKey="cycle-discussion">
            <HyvorComments entity='cycle' id={`${cycle.id}`} session={session}  />
          </TabPane>
          <TabPane eventKey="eurekas">
              <CycleDetailDiscussion cycle={cycle} className="mb-5" cacheKey={['POSTS',JSON.stringify(cyclePostsProps)]} />
              <Row>
                <Col>
                  <MosaicContext.Provider value={{ showShare: true }}>
                    {renderPosts()}
                  </MosaicContext.Provider>
                </Col>
              </Row> 
          </TabPane>
          <TabPane eventKey="guidelines">
            <section className="text-primary">
              <h3 className="h5 mt-4 mb-3 fw-bold text-gray-dark">{t('guidelinesMP')}</h3>
            </section>
            <section className=" pt-3">{cycle.guidelines && renderGuidelines()}</section>
          </TabPane>
          <TabPane eventKey="participants">
              {renderParticipants()}
          </TabPane>
        </Suspense>

        
      );
      const allowed = participants && participants.findIndex(p=>p.id==session?.user.id)>-1
        || cycle.creatorId == session?.user.id;
      if(allowed)return res;

      if (cycle.access === 3) return '';
      if (cycle.access === 1) return res;
      if ([2,4].includes(cycle.access) && (cycleContext.cycle?.currentUserIsCreator || cycleContext.cycle?.currentUserIsParticipant)) return res;
    }
    return '';
  };

  const RenderRestrictTabsHeaders:FC<{cycle:CycleDetail}> = ({cycle}) => {
    if (cycle) {
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
              <span className="mb-3">{t('Participants')} ({participants?.length})</span>
            </NavLink>
          </NavItem>
        </>
      );
      const allowed = participants && participants.findIndex(p=>p.id==session?.user.id)>-1
        || cycle.creatorId == session?.user.id;
      if(allowed)return res;
      if (cycle.access === 3) return <></>;
      if (cycle.access === 1) return res;
      if ([2, 4].includes(cycle.access) && (cycleContext.cycle?.currentUserIsCreator || cycleContext.cycle?.currentUserIsParticipant)) return res;
    }
    return <></>;
  };

  const getDefaultActiveKey = () => {
    if (cycle) {
      if (cycle.access === 1) {
        if (cycleContext.currentUserIsParticipant) return 'cycle-discussion';
        return 'cycle-about';
      }
      if ([2, 4].includes(cycle.access) && (cycleContext.cycle?.currentUserIsCreator || cycleContext.cycle?.currentUserIsParticipant)) return 'cycle-discussion';
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
    

{
// (!editPostOnSmallerScreen.value) ? 
  <>
      {!post && renderCycleDetailHeader()}
      {post && cycle && (
        <MosaicContext.Provider value={{ showShare: true }}>
          <PostDetailComponent cacheKey={['POST',post.id.toString()]} postId={post.id} work={work} session={session} />
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
                            {t('About')}
                          </span>
                        </NavLink>
                      </NavItem>
                      <RenderRestrictTabsHeaders cycle={cycle}/>
                    </Nav>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <TabContent>
                      <TabPane eventKey="cycle-about">
                            <h3 className="h5 mt-4 mb-3 fw-bold text-gray-dark">{t('WhyJoin')}</h3>
                        {cycle.contentText != null && (
                          <div className="">
                            <div
                              className={styles.dangerouslySetInnerHTML}
                              dangerouslySetInnerHTML={{ __html: cycle.contentText }}
                            />
                            {/* <UnclampText text={cycle.contentText} clampHeight="7rem" /> */}
                          </div>
                        )}
                        <div ref={cycleWorksRef}>
                          <MosaicContext.Provider value={{ showShare: true }}>                     
                            {works && <CycleDetailWorks cycleWorksDates={works! as unknown as CycleWork[]} /> || ''}
                          </MosaicContext.Provider>
                        </div>
                        {cycle.complementaryMaterials && cycle.complementaryMaterials.length > 0 && (
                          <Row className="mt-5 mb-5">
                            <Col className='col-12'>
                              <h4 className="h5 mt-5 mb-3 fw-bold text-gray-dark">{t('complementaryMaterialsTitle')}</h4>
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
