import { Prisma } from '@prisma/client';
import { useQuery } from 'react-query';
import { PostMosaicItem } from './types/post';

interface Options {
  staleTime?: number;
  enabled?: boolean;
}

export const getRecords = async (w?:string): Promise<PostMosaicItem[] | undefined> => {
  const url = `/api/post${w ? `?where=${w}`:''}`;
  const res = await fetch(url);
  if (!res.ok) return undefined;
  const {data} = await res.json();
  data.forEach((p:PostMosaicItem)=>p.type='post');
  return data;
};



const usePosts = (cycleId?:number|string,workId?:number|string, options?: Options) => {
  let where:Prisma.PostWhereInput = {};
  if(cycleId){
    if(!workId)
      where = {cycles:{some:{id:+cycleId}}}
    else 
      where = {
        cycles:{
          some:{
            id:+cycleId,
            works:{
              some:{
                id:+workId
              }
            }
          },
          
        }
      }
  }
  else if(workId){
    where = {works:{some:{id:+workId}}}
  }
  let w = encodeURIComponent(JSON.stringify(where))

  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  let k = `${cycleId ? `cycle-${cycleId}`:''}${workId ? `${cycleId ? '-': ''}work-${workId}`:''}`;
     
  return useQuery<PostMosaicItem[] | undefined>(['POSTS', k], () => getRecords(w), {
    staleTime,
    enabled,
  });
};

export default usePosts;
