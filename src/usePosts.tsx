import { useQuery } from 'react-query';
import { PostDetail } from './types/post';
import { Prisma } from '@prisma/client';
import { WEBAPP_URL } from './constants';

export const getPosts = async (
  lang?:string,
  props?:Prisma.PostFindManyArgs,
): Promise<{posts:PostDetail[],fetched:number,total:number}> => {
  const query = props?`?props=${encodeURIComponent(JSON.stringify(props))}&lang=${lang}`:''
  const url = `${WEBAPP_URL}/api/post${query}`
  const res = await fetch(url);
  if (!res.ok) return {posts:[],fetched:0,total:-1};
  const {data:posts,fetched,total} = await res.json();
  return {posts,fetched,total};
};


interface Options {
  staleTime?: number;
  enabled?: boolean;
  cacheKey?:string[];
}

const usePosts = (props?:Prisma.PostFindManyArgs, cacheKey?:string[],lang?:string) => {
  // const { staleTime, enabled, cacheKey } = options || {
  //   staleTime: 1000 * 60 * 60,
  //   enabled: true,
  // };
  let ck = cacheKey ? cacheKey : ['POSTS', `${JSON.stringify(props)}`];
 
  return useQuery<{posts:PostDetail[],fetched:number,total:number}>(ck, () => getPosts(lang,props), {
    staleTime:1000 * 60 * 60,
    enabled:cacheKey&&cacheKey[1]!='undefined',
    // retry:3
  });
};

export default usePosts;
