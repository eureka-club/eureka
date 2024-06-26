import { useQuery } from 'react-query';
import { PostDetail } from './types/post';
import { Prisma } from '@prisma/client';

export type CycleItem = PostDetail;
export type WhereT = {filtersWork:number[]}

export const getRecords = async (cycleId:number,page: number,where?:WhereT): Promise<{items:CycleItem[],total:number}|undefined> => {
  if (!cycleId) return undefined;
  let w=''
  if(where)w=encodeURIComponent(JSON.stringify(where))
  const url = `/api/cycle/${cycleId}/items?page=${page}&where=${w}`;

  const res = await fetch(url);
  if (!res.ok) return undefined;
  const {items,total} = await res.json();
  
  return {items,total};
};
interface Options {
  staleTime?: number;
  enabled?: boolean;
}

const useCycleItem = (cycleId:number,page: number,where?:WhereT, options?: Options) => {
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  const w = JSON.stringify(where)
  return useQuery<{items:CycleItem[],total:number}|undefined>(
    ['ITEMS', `CYCLE-${cycleId}`],
    ()=> getRecords(cycleId,page,where),{ keepPreviousData : true,staleTime,enabled }
  );
};

export default useCycleItem

