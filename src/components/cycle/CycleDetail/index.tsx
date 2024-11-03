import dayjs from 'dayjs';
import { useAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, MouseEvent, useState, useRef, useEffect, lazy, FC } from 'react';
import { Row, Col, NavItem, NavLink } from 'react-bootstrap';
import { MosaicContext } from '@/src/useMosaicContext';
import { ASSETS_BASE_URL, DATE_FORMAT_SHORT_MONTH_YEAR, /* , HYVOR_WEBSITE_ID, WEBAPP_URL */ } from '@/src/constants';
import { PostDetail } from '@/src/types/post';
import { WorkDetail } from '@/src/types/work';
import PostDetailComponent from '../../post/PostDetail';
// import HyvorComments from '@/src/components/common/HyvorComments';
import detailPagesAtom from '@/src/atoms/detailPages';
import globalModalsAtom from '@/src/atoms/globalModals';
import styles from './index.module.css';
import { useCycleContext } from '@/src/useCycleContext';
// import CycleDetailHeader from './CycleDetailHeader';
import useCycle from '@/src/useCycleDetail';
import usePosts from '@/src/usePosts'
import { CycleDetail } from '@/src/types/cycle';
// import { useCycleParticipants } from '@/src/hooks/useCycleParticipants';
import { RenderCycleDetailHeader } from '../RenderCycleDetailHeader';
import HyvorComments from '../../common/HyvorComments';
import CycleDetailDiscussion from '../CycleDetailDiscussion';
import { RenderPosts } from './RenderPosts';
import { RenderGuidelines } from './RenderGuideLines';
import { TabPanelSwipeableViews } from '../../common/TabPanelSwipeableViews';
import { useOnCycleCommentCreated } from '../../common/useOnCycleCommentCreated';
import { Box } from '@mui/material';
// const CycleDetailDiscussion = lazy(() => import ('./CycleDetailDiscussion')) 
// const CycleDetailWorks = lazy(() => import('../CycleDetailWorks'))
interface Props {
  post?: PostDetail;
  work?: WorkDetail;
}

const cyclePostsProps = (cycleId:number)=>({take:8,where:{cycles:{some:{id:cycleId}}}});


const CycleDetailComponent: FunctionComponent<Props> = ({
  post,
  work,
}) => {
  const cycleContext = useCycleContext();
  const router = useRouter();
  const{data:session}=useSession();
  
  const [indexActive, setindexActive] = useState(-1);
  // const [tabKey, setTabKey] = useState<string>();
  
  useEffect(()=>{
    if(router.query.tabKey){
      switch(router.query.tabKey){
        case 'about':
          setindexActive(0);
          break;
        case 'discussion':
          setindexActive(1);
          break;
        case 'eurekaMoments':
          setindexActive(2);
          break;
        case 'guidelines':
          setindexActive(3);
          break;
      }
    }
    else
      setindexActive(0);
  },[router.query]);

  useEffect(()=>{
    if(router.query.tabKey){
      const c = document.querySelector('#tab-container');
      c?.scrollIntoView({block:"start",inline:"start"});    
    }
  },[indexActive]);

  const [cycleId,setCycleId] = useState<string>('')
  useEffect(()=>{
    if(router?.query){
      if(router.query.id){
        setCycleId(router.query.id?.toString())
      }
      // if(router.query.tabKey)setTabKey(router.query.tabKey.toString())
    }
  },[router])

  const {data:cycle,isLoading} = useCycle(+cycleId
  //   ,{
  //   enabled:!!cycleId
  // }
);

const {data:dataPosts} = usePosts(cyclePostsProps(+cycleId),['CYCLE',`${cycleId}`,'POSTS']);
const{dispatch}=useOnCycleCommentCreated(cycleId);
  // const works = cycle?.cycleWorksDates?.length
  //   ? cycle?.cycleWorksDates
  //   : cycle?.works.map(w=>({id:w.id,workId:w.id,work:w,startDate:new Date(),endDate:new Date()}))

  // const{data:participants}=useCycleParticipants(cycle?.id!
  //   ,{enabled:!!cycle?.id!}
  // );

  const [detailPagesState, setDetailPagesState] = useAtom(detailPagesAtom);
  // const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
 // const [editPostOnSmallerScreen,setEditPostOnSmallerScreen] = useAtom(editOnSmallerScreens);
  
  //const {data:session, status} = useSession();
  const { t } = useTranslation('cycleDetail');
  
  // const tabContainnerRef = useRef<HTMLDivElement>(null);
  const cycleWorksRef = useRef<HTMLDivElement>(null);
  // const [filtersContentType, setFiltersContentType] = useState<string[]>([]);
    
  if(!cycle)return <></>

  // const handleSubsectionChange = (key: string | null) => {
  //   if (key != null) {
  //     // setTabKey(key);

  //     setDetailPagesState({ ...detailPagesState, selectedSubsectionCycle: key });
  //   }
  // };

  const onCarouselSeeAllAction = async () => {
    // setTabKey('cycle-about');
    if (cycleWorksRef)
      cycleWorksRef.current!.scrollIntoView({
        behavior: 'smooth',
      });
  };

  // const onParticipantsAction = async () => {
  //   setTabKey('participants');
  //   if (tabContainnerRef)
  //     tabContainnerRef.current!.scrollIntoView({
  //       behavior: 'smooth',
  //     });
  // };

   /*const handleEditPostOnSmallerScreen = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
        setEditPostOnSmallerScreen({ ...editOnSmallerScreens, ...{ value: !editPostOnSmallerScreen.value } });
  };*/
  

  // const RenderRestrictTabsHeaders:FC<{cycle:CycleDetail}> = ({cycle}) => {
  //   if (cycle) {
  //     const res = (
  //       <>
  //         <NavItem className={`cursor-pointer ${styles.tabBtn}`}>
  //           <NavLink eventKey="cycle-discussion">
  //             <span className="mb-3">{t('Discussion')}</span>
  //           </NavLink>
  //         </NavItem>
  //         <NavItem className={`cursor-pointer ${styles.tabBtn}`}>
  //           <NavLink eventKey="eurekas">
  //             <span className="mb-3">{t('EurekaMoments')} ({dataPosts?.total})</span>
  //           </NavLink>
  //         </NavItem>
  //         {/* <NavItem className={`${styles.tabBtn}`}>
  //           <NavLink eventKey="my_milestone">{t('My milestones')}</NavLink>
  //         </NavItem> */}
  //         <NavItem className={`cursor-pointer ${styles.tabBtn}`}>
  //           <NavLink eventKey="guidelines">
  //             <span className="mb-3">{t('Guidelines')}</span>
  //           </NavLink>
  //         </NavItem>

  //         <NavItem className={`cursor-pointer ${styles.tabBtn}`}>
  //           <NavLink eventKey="participants">
  //             <span className="mb-3">{t('Participants')} ({cycle?.participants.length})</span>
  //           </NavLink>
  //         </NavItem>
  //       </>
  //     );
  //     const allowed = cycle?.participants && cycle?.participants.findIndex(p=>p.id==session?.user.id)>-1
  //       || cycle.creatorId == session?.user.id;
  //     if(allowed)return res;
  //     if (cycle.access === 3) return <></>;
  //     if (cycle.access === 1) return res;
  //     if ([2, 4].includes(cycle.access) && (cycleContext.cycle?.currentUserIsCreator || cycleContext.cycle?.currentUserIsParticipant)) return res;
  //   }
  //   return <></>;
  // };

  // const getDefaultActiveKey = () => {
  //   if (cycle) {
  //     if (cycle.access === 1) {
  //       if (cycleContext.currentUserIsParticipant) return 'cycle-discussion';
  //       return 'cycle-about';
  //     }
  //     if ([2, 4].includes(cycle.access) && (cycleContext.cycle?.currentUserIsCreator || cycleContext.cycle?.currentUserIsParticipant)) return 'cycle-discussion';
  //     if (cycle.access === 3 && cycleContext.currentUserIsParticipant) return 'cycle-discussion';
  //   }
  //   return 'cycle-about';
  // };

  // const removeCycle = async (e:MouseEvent<HTMLButtonElement>) => {
  //   e.preventDefault()
  //   if(cycle){
  //     const res = await fetch(`/api/cycle/${cycle.id}`,{
  //       method:'delete',
  //     });
  //     if(res.ok){
  //       const json = await res.json();
  //       return json;
  //     }
  //     else{
  //       setGlobalModalsState({
  //         ...globalModalsState,
  //         showToast: {
  //           show: true,
  //           type: 'warning',
  //           title: t(`common:${res.statusText}`),
  //           message: res.statusText,
  //         },
  //       });
  //     }
  //   }
  //   return null;
  // };

  const GetTabPanelItems=()=>{
    let res:any = [{
      label:t('About'),
      content:<>
        <h3 className="h5 mt-4 mb-3 fw-bold text-gray-dark">{t('WhyJoin')}</h3>
        {cycle.contentText != null && (
          <div className="">
            <div
              className={styles.dangerouslySetInnerHTML}
              dangerouslySetInnerHTML={{ __html: cycle.contentText }}
            />
          </div>
        )}
        {/* <div ref={cycleWorksRef}>
          <MosaicContext.Provider value={{ showShare: true }}>                     
            {works && <CycleDetailWorks cycleWorksDates={works! as unknown as CycleWork[]} /> || ''}
          </MosaicContext.Provider>
        </div> */}
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
      </>
    }];
    if(cycle && session){
      const allowed=cycle?.participants.findIndex(p=>p.id==session?.user.id)!=-1 || session?.user.id==cycle?.creatorId
      if(session && allowed){
        //Discussion
        res.push({
          label:t('Discussion'),
          content:<>
            <HyvorComments 
              entity='cycle' 
              id={`${cycle.id}`} 
              session={session!}  
              OnCommentCreated={(comment)=>dispatch(comment)}
            />
          </>
        });
        //Eurekas
        res.push({
          label:`${t('EurekaMoments')} (${dataPosts?.total})`,
          content:<>
          <CycleDetailDiscussion cycle={cycle} className="mb-5" cacheKey={['POSTS',JSON.stringify(cyclePostsProps(cycle.id))]} />
          <MosaicContext.Provider value={{ showShare: true }}>
            <RenderPosts cycleId={cycle.id}/>
          </MosaicContext.Provider>
        </>
        });
        //Guidelines
        res.push({
          label:t('Guidelines'),
          content:<>
            <h3 className="h5 mt-4 mb-3 fw-bold text-gray-dark">{t('guidelinesMP')}</h3>
            <RenderGuidelines cycle={cycle}/>
          </>
        });
        //Participants
        res.push({
          label:`${t('Participants')} (${cycle.participants.length+1})`,
          linkTo:`${router.basePath}/cycle/${cycleId}/participants`,
          // content:<RenderParticipants cycle={cycle}/>
        })
      }
    }
    return res;
  }
  return (
    <>
    {
      <>
        {
          !post 
          ? <RenderCycleDetailHeader 
            cycle={cycle}
            // onParticipantsAction={onParticipantsAction}
            onCarouselSeeAllAction={onCarouselSeeAllAction}
            /> 
          : <></>
        }
        {post && cycle && (
          <MosaicContext.Provider value={{ showShare: true }}>
            <PostDetailComponent cacheKey={['POST',post.id.toString()]} postId={post.id} work={work} session={session!} />
          </MosaicContext.Provider>
        )}
        {
        cycle && post == null && (
          // <Row className="mb-5" ref={tabContainnerRef}>
          //   <Col>
          //     {detailPagesState.selectedSubsectionCycle != null && (
          //       <TabPanelSwipeableViews indexActive={0} items={GetTabPanelItems()}/>
          //     )}
          //   </Col>
          // </Row>
          <Box paddingTop={3} id="tab-container">
            {detailPagesState.selectedSubsectionCycle != null && (
                <TabPanelSwipeableViews indexActive={indexActive} items={GetTabPanelItems()}/>
              )}
          </Box>
        )
        }
      </> 
    }
    </>
  );
};

export default CycleDetailComponent;
