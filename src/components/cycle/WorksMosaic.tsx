// import { CycleWork } from '@prisma/client';
// import dayjs from 'dayjs';
// import isBetween from 'dayjs/plugin/isBetween';
// import { FunctionComponent, useEffect, useState } from 'react';
// // import Spinner from 'react-bootstrap/Spinner';
// // import { useQuery } from 'react-query';

// import { WorkDetail } from '../../types/work';
// import Mosaic from '../Mosaic';
// import { CycleDetail } from '../../types/cycle';
// import { Work } from '.prisma/client';
// // import { MosaicItem } from '../types/work';
// import useWorks from '@/src/useWorksDetail'
// interface Props {
//   cycle: CycleDetail;
//   className?: string;
// }
// dayjs.extend(isBetween);
// const WorksMosaic: FunctionComponent<Props> = ({ cycle, className }) => {

//   const { data: dataWorks } = useWorks({ where:{cycles: { some: { id: cycle?.id } }} }, {
//     enabled:!!cycle?.id
//   })
//   const [works,setWorks] = useState(dataWorks?.works)
//   useEffect(()=>{
//     if(dataWorks)setWorks(dataWorks.works)
//   },[dataWorks])

//   // const { isLoading, isSuccess, data } = useQuery<WorkDetail[]>(
//   //   ['works.mosaic.cycle', cycle.id],
//   //   async ({ queryKey: [, cycleId] }) => {
//   //     const whereQP = encodeURIComponent(JSON.stringify({ cycles: { some: { id: cycleId } } }));
//   //     const includeQP = encodeURIComponent(JSON.stringify({ localImages: true }));
//   //     const res = await fetch(`/api/search/works?where=${whereQP}&include=${includeQP}`);

//   //     return res.json();
//   //   },
//   // );
//   const getWorksSorted = () => {
//     const res: Work[] = [];
//     if(cycle && !cycle.cycleWorksDates)return works||[];
//     cycle.cycleWorksDates
//       .sort((f, s) => {
//         const fCD = dayjs(f.startDate!);
//         const sCD = dayjs(s.startDate!);
//         const isActive = (w: {startDate:Date|null,endDate:Date|null}) => {
//           if (w.startDate && w.endDate) return dayjs().isBetween(w.startDate!, w.endDate);
//           if (w.startDate && !w.endDate) return dayjs().isAfter(w.startDate);
//           return false;
//         };

//         if (isActive(f) && !isActive(s)) return -1;
//         if (!isActive(f) && isActive(s)) return 1;
//         if (fCD.isAfter(sCD)) return 1;
//         if (fCD.isSame(sCD)) return 0;
//         return -1;
//       })
//       .forEach((cw) => {
//         if (works) {
//           const idx = works.findIndex((w) => w.id === cw.workId);
//           res.push(works[idx]);
          
//         }
//       });

//     if (cycle.cycleWorksDates.length) return res;
//     return works||[];
//   };
//   return (
//     <>
//       {/* {isLoading && (
//         <Spinner animation="border" role="status">
//           <span className="sr-only">Loading...</span>
//         </Spinner>
//       )} */}
//       {
//         /* isSuccess && */ works != null && (
//           <Mosaic cacheKey={['CYCLE',cycle.id.toString()]} className={className} showButtonLabels={false} stack={getWorksSorted() as WorkDetail[]} />
//         )
//       }
//     </>
//   );
// };

// export default WorksMosaic;
export default {}