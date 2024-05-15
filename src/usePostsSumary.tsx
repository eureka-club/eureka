import { useQuery } from 'react-query';
import { PostSumary } from './types/post';
import { Prisma } from '@prisma/client';
import useTranslation from 'next-translate/useTranslation';
import { WEBAPP_URL } from './constants';
import { useSession } from 'next-auth/react';
// import { buildUrl } from 'build-url-ts';

export const getPostsSumary = async (
  sessionId:number|null,
  lang?:string,
  props?:Prisma.PostFindManyArgs,
): Promise<{posts:PostSumary[],fetched:number,total:number}> => {
  // const query = props?`?props=${encodeURIComponent(JSON.stringify(props))}&lang=${lang}`:''
  const url = `${WEBAPP_URL}/api/post/sumary`
  const res = await fetch(url,{
    method:'POST',
    body:JSON.stringify({
      lang,
      props,
      sessionId
    }),
    headers:{
      'Content-type':"application/json"
    }
  });
  if (!res.ok) return {posts:[],fetched:0,total:-1};
  const {posts,fetched,total} = await res.json();
  return {posts,fetched,total};
};


interface Options {
  staleTime?: number;
  enabled?: boolean;
  cacheKey?:string|string[];
}

const usePostsSumary = (props?:Prisma.PostFindManyArgs, options?: Options) => {
  const Props = !props ? {take:6} : {take:6,...props};
  const {lang}=useTranslation();
  const{data:session}=useSession();
  const { staleTime, enabled, cacheKey } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  let ck = cacheKey ? cacheKey : ['POSTS', `${JSON.stringify(Props)}`];
 
  return useQuery<{posts:PostSumary[],fetched:number,total:number}>(ck, () => getPostsSumary(session?.user.id!,lang,Props), {
    staleTime,
    enabled,
    // retry:3
  });
};

export default usePostsSumary;
