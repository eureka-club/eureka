import { useQuery } from 'react-query';
import { PostMosaicItem } from './types/post';
import { CommentMosaicItem } from './types/comment';
import { Prisma } from '@prisma/client';

export type CycleItem = PostMosaicItem | CommentMosaicItem;
export type WhereT = {filtersWork:number[]}

const getCycleItems = async (cycleId:string,page?: string,where?:WhereT): Promise<{items:CycleItem[],total:number}|undefined> => {
  if (!cycleId) return undefined;
  let w='';
  if(where)w=encodeURIComponent(JSON.stringify(where))
  const url = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/api/cycle/${cycleId}/items?page=${page}&where=${w}`;

  const res = await fetch(url);
  if (!res.ok) return undefined;
  return res.json();
};

interface Options {
  staleTime?: number;
  enabled?: boolean;
}



const useCycleItem = (cycleId:string,page?: string,where?:WhereT, options?: Options) => {
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  const w = JSON.stringify(where)
  return useQuery<{items:CycleItem[],total:number}|undefined>(
    ['ITEMS', `CYCLE-${cycleId}`],
    ()=> getCycleItems(cycleId,page,where),{ keepPreviousData : true,staleTime,enabled }
  );
};

export {getCycleItems,useCycleItem}

