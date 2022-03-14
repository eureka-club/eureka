// import { Work } from '@prisma/client';
import { flatten, zip } from 'lodash';
import { FunctionComponent, useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { useQuery } from 'react-query';
import useCycles from '@/src/useCycles'
import usePosts from '@/src/usePosts'
import Mosaic from '../Mosaic';
import { MosaicItem } from '../../types';
import { CycleMosaicItem } from '../../types/cycle';
import { PostMosaicItem } from '../../types/post';
import { WorkMosaicItem } from '../../types/work';
import ListWindow from '@/components/ListWindow'
interface Props {
  work: WorkMosaicItem;
}

const CombinedMosaic: FunctionComponent<Props> = ({ work }) => {
  // const {
  //   isLoading: isCyclesLoading,
  //   isSuccess: isCyclesSuccess,
  //   data: cyclesData,
  // } = useQuery<CycleMosaicItem[]>(['work.mosaic.cycles', work.id], async ({ queryKey: [, workId] }) => {
  //   const whereQP = encodeURIComponent(JSON.stringify({ works: { some: { id: workId } } }));
  //   const includeQP = encodeURIComponent(JSON.stringify({ localImages: true }));
  //   const res = await fetch(`/api/search/cycles?where=${whereQP}&include=${includeQP}`);

  //   return res.json();
  // });

  // const {
  //   isLoading: isPostsLoading,
  //   isSuccess: isPostsSuccess,
  //   data: postsData,
  // } = useQuery<PostMosaicItem[]>(['posts.mosaic.work', work.id], async ({ queryKey: [, workId] }) => {
  //   const whereQP = encodeURIComponent(JSON.stringify({ works: { some: { id: workId } } }));
  //   const includeQP = encodeURIComponent(JSON.stringify({ creator: {photos:true}, localImages: true, works: true }));
  //   const res = await fetch(`/api/search/posts?where=${whereQP}&include=${includeQP}`);

  //   return res.json();
  // });
  const [mosaicData, setMosaicData] = useState<MosaicItem[]>([]);
  const {data:cycles,isLoading:isLoadingCycles} = useCycles({
    works:{
      some:{
        id:work.id
      }
    }
  },{enabled:!!work.id})


  const {data:posts} = usePosts({
    works:{
      some:{
        id:work.id
      }
    }
  },undefined,{enabled:!!work.id})


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
      {mosaicData.length > 0 
      && <ListWindow items={mosaicData as unknown as (WorkMosaicItem|CycleMosaicItem)[]} cacheKey={['WORK', `${work.id}`]} height={400} width={'100%'}/>
      // && <Mosaic
      //   cacheKey={['WORK',work.id.toString()]} 
      //   stack={mosaicData} 
      //   parent={work} />
      }
    </>
  );
};

export default CombinedMosaic;
