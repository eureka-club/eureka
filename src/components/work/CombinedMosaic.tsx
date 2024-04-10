// import { Work } from '@prisma/client';
import { flatten, zip } from 'lodash';
import { FunctionComponent, useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { useQuery } from 'react-query';
import useCycles from '@/src/useCycles'
import usePosts from '@/src/usePosts'
import Mosaic from '../Mosaic';
import { MosaicItem } from '../../types';
import { CycleDetail } from '../../types/cycle';
import { PostDetail } from '../../types/post';
import { WorkDetail } from '../../types/work';

interface Props {
  work: WorkDetail;
}

const CombinedMosaic: FunctionComponent<Props> = ({ work }) => {
  // const {
  //   isLoading: isCyclesLoading,
  //   isSuccess: isCyclesSuccess,
  //   data: cyclesData,
  // } = useQuery<CycleDetail[]>(['work.mosaic.cycles', work.id], async ({ queryKey: [, workId] }) => {
  //   const whereQP = encodeURIComponent(JSON.stringify({ works: { some: { id: workId } } }));
  //   const includeQP = encodeURIComponent(JSON.stringify({ localImages: true }));
  //   const res = await fetch(`/api/search/cycles?where=${whereQP}&include=${includeQP}`);

  //   return res.json();
  // });

  // const {
  //   isLoading: isPostsLoading,
  //   isSuccess: isPostsSuccess,
  //   data: postsData,
  // } = useQuery<PostDetail[]>(['posts.mosaic.work', work.id], async ({ queryKey: [, workId] }) => {
  //   const whereQP = encodeURIComponent(JSON.stringify({ works: { some: { id: workId } } }));
  //   const includeQP = encodeURIComponent(JSON.stringify({ creator: {photos:true}, localImages: true, works: true }));
  //   const res = await fetch(`/api/search/posts?where=${whereQP}&include=${includeQP}`);

  //   return res.json();
  // });
  const [mosaicData, setMosaicData] = useState<MosaicItem[]>([]);
  const {data:dataCycles,isLoading:isLoadingCycles} = useCycles('',{
    where:{works:{
      some:{
        id:work.id
      }
    }}
  },{enabled:!!work.id})
  const [cycles,setCycles] = useState(dataCycles?.cycles);

  useEffect(()=>{
    if(dataCycles){
      setCycles(dataCycles.cycles)
    }
  },[dataCycles])


  const {data:dataPosts} = usePosts({
    where:{
      works:{
        some:{
          id:work.id
        }
      }
    }
  })
  const [posts,setPosts] = useState(dataPosts?.posts);

  useEffect(()=>{
    if(dataPosts){
      setPosts(dataPosts.posts)
    }
  },[dataPosts])


  let cyclesCount = 0;
  let postsCount = 0;
  if(posts)postsCount = posts.length
  if(cycles)cyclesCount = cycles.length
  

  useEffect(() => {
      const interleavedMosaicItems = flatten(zip((cycles||[]), (posts||[]))).filter((i) => i != null) as MosaicItem[];
      setMosaicData(interleavedMosaicItems);    
  }, [posts,cycles]);

  return (
    <>
      {/* {(isCyclesLoading) && <Spinner animation="grow" role="status" />} */}
      {mosaicData.length > 0 && <Mosaic
        cacheKey={['WORK',work.id.toString()]} 
        // className='d-flex justify-content-center justify-content-md-start' 
        stack={mosaicData} 
        parent={work} />}
    </>
  );
};

export default CombinedMosaic;
