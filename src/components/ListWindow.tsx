// import React,{useEffect,useMemo,useRef,useState} from 'react'
// import { MosaicItem, isCycleDetail, isWorkMosaicItem, isPostMosaicItem, isUserMosaicItem, isPost } from '@/src/types';
// import { FixedSizeList } from 'react-window';
// import MosaicItemCycle from './cycle/MosaicItem';
// import MosaicItemPost from './post/MosaicItem';
// import MosaicItemWork from './work/MosaicItem';
// import MosaicItemUser from './user/MosaicItem';

// import { v4 } from 'uuid';
// import { CycleDetail } from '../types/cycle';
// import { WorkDetail } from '../types/work';
// import { PostDetail } from '../types/post';
// import { CycleContext } from '../useCycleContext';

// interface Props{
//     items:MosaicItem[];
//     cacheKey: string[];
//     parent?: CycleDetail | WorkDetail;
//     itemSize?:number
//     width?:string,
//     itemsByRow:number
// }
// const ListWindow:React.FC<Props> = ({items:it,parent,cacheKey,itemSize=400,width="100%",itemsByRow})=>{
    
//     const mosaics = useMemo(()=>{
//       let mosaics:JSX.Element[] = []
//       if(it){
//         const items = [...it]

//         const allParticipants = items.every(x => isUserMosaicItem(x));
//         if(allParticipants){
//           if(!itemsByRow || itemsByRow == 4)
//              itemsByRow = 5 ;
//           itemSize = 80;
//         }

//         while(items.length){
//           const a = items.splice(0,itemsByRow)
//           const rows = []
//           for(let item of a){
//               if (isCycleDetail(item)) {
//                 rows.push(<CycleContext.Provider value={{ cycle: item as CycleDetail }}>
//                     <MosaicItemCycle key={`${v4()}`} cycleId={item.id} detailed className="me-3 my-6"/>
//                   </CycleContext.Provider>)
//               }
//               else if (isPostMosaicItem(item)) {
//                 // let pp = parent;
//                 // if (!pp) {
//                 //   const it: PostDetail = item as PostDetail;
//                 //   if (it.works && it.works.length) pp = it.works[0] as WorkDetail;
//                 //   else if (it.cycles && it.cycles.length > 0) pp = it.cycles[0] as CycleDetail;
//                 // }
//                 // const cycleId = isCycleDetail(pp!) ? pp.id : undefined;
//                 // const workId = isWorkMosaicItem(pp!) ? pp.id : undefined;
            
//                 rows.push(<MosaicItemPost
//                     key={`${v4()}`}
//                     showComments={true}
//                     postId={item.id}
//                     display={'v'}
//                     cacheKey={cacheKey}
//                     className="me-3 my-6"
//                   />)
                
//               }
//               else if (isWorkMosaicItem(item)) {
                
//                   // <WorkContext.Provider value={{ linkToWork: true }}>
//                   rows.push(<MosaicItemWork 
//                     linkToWork showShare={false} showButtonLabels={false} key={`${v4()}`} workId={item.id} className="me-3 my-6"/>)
//                   // </WorkContext.Provider>
                
//               }
//               else if (isUserMosaicItem(item)) {
//                 rows.push(<MosaicItemUser key={`${v4()}`} user={item} className=" me-3 mb-2 my-6" />);
//               }
//               // else if(isCommentMosaicItem(item)){
//               //   const it: CommentMosaicItem = item as CommentMosaicItem;
//               //   rows.push(<MosaicItemComment detailed commentId={it.id} cacheKey={cacheKey} />);                      
//               // }
//             }
//             mosaics.push(
//               <section className="d-flex justify-content-center">{rows.map(
//                 r=><section className="my-2" data-cy="items" key={v4()}>{r}</section>
//                 )}</section>
//             )
//         }            
//       }
//       return mosaics;
//     },[it,cacheKey])

//     const renderItem = (props:{ index:number, style:Record<string,any> }) => {
//       const {index,style} = props;
//       return  <section className="" style={{
//       ...style,
//       //left: `${parseFloat(style.left) + 15}px`, comento pues sale scroll eje x
//     }}>
//         <aside className={`p-4 mb-3`} key={`${v4()}`}>
//               {mosaics[index]}
//         </aside>
//       </section>
//     };


//       const getSize = (index:number) => {
//           if(isPostMosaicItem(it[index]))
//             return 355;
//           else return 200  
//       };
      
//         return <>
//           <FixedSizeList
//             className=''
//             height={globalThis.window.innerHeight}
//             itemCount={mosaics.length}
//             itemSize={itemSize+16}//+16 because->post mosaic: my-6(12px) and row section: my-2(4px)
//             //layout="vertical"
//             width={width}
//           >
//             {renderItem}  
//           </FixedSizeList>
//         </>

// }
// export default ListWindow;
export const o = {}