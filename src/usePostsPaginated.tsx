import { useQuery } from 'react-query';
import { PostDetail } from './types/post';


export const POST_COUNT = +(process.env.NEXT_PUBLIC_TAKE || 10);

export const getRecords = async (cycleId:number,page: number): Promise<{posts:PostDetail[],hasNextPage:boolean}|undefined> => {
  if (!cycleId) return undefined;
  const where = encodeURIComponent(JSON.stringify({
    cycles:{some:{id:cycleId}}
  }))
  const url = `/api/post?take=${POST_COUNT}&page=${page}&where=${where}`;

  const res = await fetch(url);
  if (!res.ok) return undefined;
  const {data:posts,hasNextPage} = await res.json();
  posts.forEach((p:PostDetail) => {
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
  return useQuery<{posts:PostDetail[],hasNextPage:boolean}|undefined>(['POSTS', `CYCLE-${cycleId}-PAGE-${page}`], ()=> getRecords(cycleId,page),{ keepPreviousData : true });
};

export default usePostsPaginated

