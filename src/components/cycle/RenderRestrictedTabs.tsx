// import { FC, Suspense, useEffect, useState } from "react";
// import { Col, Row, TabPane } from "react-bootstrap";
// import HyvorComments from "../common/HyvorComments";
// import CycleDetailDiscussion from "./CycleDetailDiscussion";
// import { Grid } from "@mui/material";
// import usePosts from "@/src/usePosts";
// import { CycleDetail } from "@/src/types/cycle";
// import { useCycleContext } from "@/src/useCycleContext";
// import { useCycleParticipants } from "@/src/hooks/useCycleParticipants";
// import { useSession } from "next-auth/react";
// import { MosaicContext } from '@/src/useMosaicContext';
// import { Button as MaterialButton } from '@mui/material';
// import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
// import useTranslation from "next-translate/useTranslation";
// import { MosaicsGrid } from "../MosaicsGrid";
//import Spinner from '@/components/common/Spinner';

// const cyclePostsProps = (cycleId:number)=>({take:8,where:{cycles:{some:{id:cycleId}}}});


// const RenderSpinnerForLoadNextCarousel = ({hasMorePosts}:{hasMorePosts:boolean})=>{
//     if(hasMorePosts) return <Spinner />
//             return <></>;
//   }

  

 



// type RenderRestrictedTabsProps={
//     cycle:CycleDetail;
// }  
// export const RenderRestrictedTabs = ({cycle}:RenderRestrictedTabsProps) => {
//     const { t } = useTranslation('cycleDetail');
    
//     const{data:session}=useSession();
//     const cycleContext = useCycleContext();
//     const{data:participants}=useCycleParticipants(cycle?.id!
//         ,{enabled:!!cycle?.id!}
//       );
    
    
//     if (cycle) {
//       const res = (
//         <Suspense fallback={<Spinner/>}>
//           <TabPane eventKey="cycle-discussion">
//             <HyvorComments entity='cycle' id={`${cycle.id}`} session={session!}  />
//           </TabPane>
//           <TabPane eventKey="eurekas">
//               <CycleDetailDiscussion cycle={cycle} className="mb-5" cacheKey={['POSTS',JSON.stringify(cyclePostsProps(cycle.id))]} />
//               <Row>
//                 <Col>
//                   <MosaicContext.Provider value={{ showShare: true }}>
//                     <RenderPosts cycleId={cycle.id}/>
//                   </MosaicContext.Provider>
//                 </Col>
//               </Row>
//           </TabPane>
//           <TabPane eventKey="guidelines">
//             <section className="text-primary">
//               <h3 className="h5 mt-4 mb-3 fw-bold text-gray-dark">{t('guidelinesMP')}</h3>
//             </section>
//             <section className=" pt-3">
//             {
//                 cycle.guidelines ? <RenderGuidelines cycle={cycle}/> : <></>
//             }
//             </section>
//           </TabPane>
//           <TabPane eventKey="participants">
//               <RenderParticipants cycle={cycle}/>
//           </TabPane>
//         </Suspense>

        
//       );
//       const allowed = participants && participants.findIndex(p=>p.id==session?.user.id)>-1
//         || cycle.creatorId == session?.user.id;
//       if(allowed)return res;

//       if (cycle.access === 3) return <></>;
//       if (cycle.access === 1) return res;
//       if ([2,4].includes(cycle.access) && (cycleContext.cycle?.currentUserIsCreator || cycleContext.cycle?.currentUserIsParticipant)) return res;
//     }
//     return <></>;
//   };
export const RenderRestrictedTabs = ()=>{}