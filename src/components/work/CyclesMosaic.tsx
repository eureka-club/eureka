// import {WorkDetail} from '@/src/types/work'
// import { FunctionComponent } from 'react';
// import Spinner from 'react-bootstrap/Spinner';
// import { useQuery } from 'react-query';
// import useCycles from '@/src/useCycles';
// import { CycleDetail } from '../../types/cycle';
// import Mosaic from '../Mosaic';

// interface Props {
//   work: WorkDetail;
// }

// const CyclesMosaic: FunctionComponent<Props> = ({ work }) => {
//   // const { isLoading, isSuccess, data } = useQuery<CycleDetail[]>(
//   //   ['work.mosaic.cycles', work.id],
//   //   async ({ queryKey: [, workId] }) => {
//   //     const whereQP = encodeURIComponent(JSON.stringify({ works: { some: { id: workId } } }));
//   //     const includeQP = encodeURIComponent(JSON.stringify({ localImages: true }));
//   //     const res = await fetch(`/api/search/cycles?where=${whereQP}&include=${includeQP}`);

//   //     return res.json();
//   //   },
//   // );
//   const {data:dataCycles,isLoading:isLoadingCycles} = useCycles('',{
//     where:{works:{
//       some:{
//         id:work.id
//       }
//     }}
//   },{enabled:!!work.id})

//   const cycles = dataCycles?.cycles || [];
//   return (
//     <>
//       {/* {isLoading && (
//         <Spinner animation="grow" role="status"/>        
//       )} */}
//       {work && cycles && <Mosaic cacheKey={['WORK',work.id.toString()]} className='d-flex justify-content-center justify-content-md-start' stack={cycles} />}
//     </>
//   );
// };
const CyclesMosaic = ()=><>not set</>
export default CyclesMosaic;
