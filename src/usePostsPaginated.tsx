import { useQuery } from 'react-query';
import { PostMosaicItem } from './types/post';


export const POST_COUNT = +(process.env.NEXT_PUBLIC_POST_COUNT || 3);
// export const WORK_COUNT = +(process.env.NEXT_PUBLIC_WORK_COUNT || 3);;
// export const COMMENT_COUNT = +(process.env.NEXT_PUBLIC_COMMENT_COUNT || 2);

export const getRecords = async (cycleId:number,page: number): Promise<{posts:PostMosaicItem[],hasNextPage:boolean}|undefined> => {
  if (!cycleId) return undefined;
  const where = encodeURIComponent(JSON.stringify({
    cycles:{some:{id:cycleId}}
  }))
  const url = `/api/post?take=${POST_COUNT}&page=${page}&where=${where}`;

  const res = await fetch(url);
  if (!res.ok) return undefined;
  const {data:posts,hasNextPage} = await res.json();
  posts.forEach((p:PostMosaicItem) => {
    p.type = 'post'
  });
  return {posts,hasNextPage};
};

interface Options {
  staleTime?: number;
  enabled?: boolean;
}



const usePostsPaginated = (cycleId:number,page: number, options?: Options) => {
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  return useQuery<{posts:PostMosaicItem[],hasNextPage:boolean}|undefined>(['POSTS', {cycleId,page}], ()=> getRecords(cycleId,page),{ keepPreviousData : true });
};

export default usePostsPaginated

