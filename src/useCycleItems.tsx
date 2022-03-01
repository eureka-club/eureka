import { useQuery } from 'react-query';
import { PostMosaicItem } from './types/post';
import { CommentMosaicItem } from './types/comment';
import { Prisma } from '@prisma/client';

export type CycleItem = PostMosaicItem | CommentMosaicItem;
export type WhereT = {filtersWork:number[]}

export const getRecords = async (cycleId:number/* ,page: number */,where?:WhereT): Promise<{items:CycleItem[],hasNextPage:boolean,total:number}|undefined> => {
  if (!cycleId) return undefined;
  let w=''
  if(where)w=encodeURIComponent(JSON.stringify(where))
  const url = `/api/cycle/${cycleId}/items?page=${0/* page */}&where=${w}`;

  const res = await fetch(url);
  if (!res.ok) return undefined;
  const {items,hasNextPage,total} = await res.json();
  
  return {items,hasNextPage,total};
};

interface Options {
  staleTime?: number;
  enabled?: boolean;
}



const useCycleItem = (cycleId:number/* ,page: number */,where?:WhereT, options?: Options) => {
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  const w = JSON.stringify(where)
  return useQuery<{items:CycleItem[],hasNextPage:boolean,total:number}|undefined>(
    // ['ITEMS', `CYCLE-${cycleId}-PAGE-${page}`],
    ['ITEMS', `CYCLE-${cycleId}`],
    ()=> getRecords(cycleId/* ,page */,where),{ keepPreviousData : true,staleTime,enabled }
  );
};

export default useCycleItem

