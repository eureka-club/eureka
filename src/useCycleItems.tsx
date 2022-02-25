import { useQuery } from 'react-query';
import { PostMosaicItem } from './types/post';
import { CommentMosaicItem } from './types/comment';

export type CycleItem = PostMosaicItem | CommentMosaicItem;

export const COUNT = +(process.env.NEXT_PUBLIC_CYCLE_DETAIL_ITEMS_COUNT || 10);

export const getRecords = async (cycleId:number,page: number): Promise<{items:CycleItem[],hasNextPage:boolean}|undefined> => {
  if (!cycleId) return undefined;
  const where = encodeURIComponent(JSON.stringify({
    cycles:{some:{id:cycleId}}
  }))
  const url = `/api/cycle/${cycleId}/items?take=${COUNT}&where=${where}`;

  const res = await fetch(url);
  if (!res.ok) return undefined;
  const {items,hasNextPage} = await res.json();
  
  return {items,hasNextPage};
};

interface Options {
  staleTime?: number;
  enabled?: boolean;
}



const useCycleItem = (cycleId:number,page: number, options?: Options) => {
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  return useQuery<{items:CycleItem[],hasNextPage:boolean}|undefined>(
    ['ITEMS', `CYCLE-${cycleId}-PAGE-${page}`],
    ()=> getRecords(cycleId,page),{ keepPreviousData : true }
  );
};

export default useCycleItem

