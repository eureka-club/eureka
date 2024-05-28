import { Suspense, useEffect, useState } from "react";
import { Col, Row, TabPane } from "react-bootstrap";
import HyvorComments from "../common/HyvorComments";
import CycleDetailDiscussion from "./CycleDetailDiscussion";
import MosaicItemUser from '@/components/user/MosaicItem'
import MosaicItemPost from '@/src/components/post/MosaicItem'
import { CircularProgress, Grid } from "@mui/material";
import usePosts from "@/src/usePosts";
import { CycleDetail } from "@/src/types/cycle";
import { useCycleContext } from "@/src/useCycleContext";
import { useCycleParticipants } from "@/src/hooks/useCycleParticipants";
import { useSession } from "next-auth/react";
import { MosaicContext } from '@/src/useMosaicContext';
import { Button as MaterialButton } from '@mui/material';
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { useInView } from 'react-intersection-observer';
import useTranslation from "next-translate/useTranslation";

const cyclePostsProps = (cycleId:number)=>({take:8,where:{cycles:{some:{id:cycleId}}}});


const RenderSpinnerForLoadNextCarousel = ({hasMorePosts}:{hasMorePosts:boolean})=>{
    if(hasMorePosts) return <CircularProgress />
            return '';
  }

  type RenderPostsProps={
    cycleId:number;
  }
const RenderPosts = ({cycleId}:RenderPostsProps)=>{
    const {data:dataPosts} = usePosts(cyclePostsProps(cycleId),['CYCLE',`${cycleId}`,'POSTS']);
    const [posts,setPosts] = useState(dataPosts?.posts)
    const hasMorePosts=dataPosts?.fetched!<dataPosts?.total!
    // const [hasMorePosts,setHasMorePosts] = useState(dataPosts?.fetched!<dataPosts?.total!);
    const [ref, inView] = useInView({
        triggerOnce: false,
    });

    useEffect(()=>{
        if(dataPosts && dataPosts.posts){
        // setHasMorePosts(dataPosts.fetched!)
        setPosts(dataPosts.posts)
        }
    },[dataPosts])

    if(posts){
      return <>
        <Row className='mt-2'>
        {posts.map((p)=><Col xs={12} sm={6} lg={3} xxl={2} key={p.id} className="mb-5 d-flex justify-content-center  align-items-center">
          <MosaicItemPost  cacheKey={['POST',`${p.id}`]} postId={p.id} showSaveForLater={false} size={'md'} />          
        </Col>
        )}
        </Row>
        <div className="mt-5" ref={ref}>
         <RenderSpinnerForLoadNextCarousel hasMorePosts={hasMorePosts}/>
        </div>
      </>
    }
    return '';
  }

const RenderGuidelines = ({cycle}:{cycle:CycleDetail}) => {
    const [gldView, setgldView] = useState<Record<string, boolean>>({});

    const toggleGuidelineDesc = (key: string) => {
        if (key in gldView) {
            setgldView((res) => {
            return { ...res, [`${key}`]: !res[key] };
            });
        } else setgldView((res) => ({ ...res, [`${key}`]: true }));
    };

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

const RenderParticipants = ({cycle}:{cycle:CycleDetail})=>{
    const{data:participants}=useCycleParticipants(cycle?.id!
        ,{enabled:!!cycle?.id!}
    );

        if(participants){
            return <Grid container spacing={2}>
                {participants.map(p=><Grid item xs={6} sm={4} md={2} key={p.email}><MosaicItemUser user={p} /></Grid>)}
            </Grid>
        }
        return ''
      }

type RenderRestrictedTabsProps={
    cycle:CycleDetail;
}  
export const RenderRestrictedTabs = ({cycle}:RenderRestrictedTabsProps) => {
    const { t } = useTranslation('cycleDetail');
    
    const{data:session}=useSession();
    const cycleContext = useCycleContext();
    const{data:participants}=useCycleParticipants(cycle?.id!
        ,{enabled:!!cycle?.id!}
      );
    
    
    if (cycle) {
      const res = (
        <Suspense fallback={<CircularProgress/>}>
          <TabPane eventKey="cycle-discussion">
            <HyvorComments entity='cycle' id={`${cycle.id}`} session={session!}  />
          </TabPane>
          <TabPane eventKey="eurekas">
              <CycleDetailDiscussion cycle={cycle} className="mb-5" cacheKey={['POSTS',JSON.stringify(cyclePostsProps(cycle.id))]} />
              <Row>
                <Col>
                  <MosaicContext.Provider value={{ showShare: true }}>
                    <RenderPosts cycleId={cycle.id}/>
                  </MosaicContext.Provider>
                </Col>
              </Row>
          </TabPane>
          <TabPane eventKey="guidelines">
            <section className="text-primary">
              <h3 className="h5 mt-4 mb-3 fw-bold text-gray-dark">{t('guidelinesMP')}</h3>
            </section>
            <section className=" pt-3">
            {
                cycle.guidelines ? <RenderGuidelines cycle={cycle}/> : <></>
            }
            </section>
          </TabPane>
          <TabPane eventKey="participants">
              <RenderParticipants cycle={cycle}/>
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