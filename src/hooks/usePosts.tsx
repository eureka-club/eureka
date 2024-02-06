import { PostDetail } from '@/src/types/post';
import { Prisma } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { WEBAPP_URL } from '../constants';
// import { buildUrl } from 'build-url-ts';

export const getPosts = async (
  //langs:string,
  props?:Prisma.PostFindManyArgs,
): Promise<{posts:PostDetail[],fetched:number,total:number}> => {
  const query = props?`?props=${encodeURIComponent(JSON.stringify(props))}`:''
  const url = `${WEBAPP_URL}/api/post${query}`
  const res = await fetch(url);
  if (!res.ok) return {posts:[],fetched:0,total:-1};
  const {data:posts,fetched,total} = await res.json();
  
  return {posts,fetched,total};
};


interface Options {
  staleTime?: number;
  enabled?: boolean;
  cacheKey?:string|string[];
}

const usePosts = (props?:Prisma.PostFindManyArgs, options?: Options) => {
  const { staleTime, enabled, cacheKey } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  let ck = cacheKey ? [`${cacheKey}-${JSON.stringify(props)}`] : ['POSTS', `${JSON.stringify(props)}`];

  return useQuery<{posts:PostDetail[],fetched:number,total:number}>({
    queryKey:ck,
    queryFn: () => getPosts(props),
    staleTime,
    enabled,
    retry:3
  });
};

export default usePosts;
