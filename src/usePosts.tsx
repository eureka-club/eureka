import { useQuery } from 'react-query';
import { PostMosaicItem } from './types/post';
import { Prisma } from '@prisma/client';
import useTranslation from 'next-translate/useTranslation';
// import { buildUrl } from 'build-url-ts';

export const getPosts = async (
  lang:string,
  props?:Prisma.PostFindManyArgs,
  origin=''
): Promise<{posts:PostMosaicItem[],fetched:number,total:number}> => {
  const query = props?`?props=${encodeURIComponent(JSON.stringify(props))}&lang=${lang}`:''
  const url = `${origin||''}/api/post${query}`
  const res = await fetch(url);
  if (!res.ok) return {posts:[],fetched:0,total:-1};
  const {data:posts,fetched,total} = await res.json();
  debugger;
  return {posts,fetched,total};
};


interface Options {
  staleTime?: number;
  enabled?: boolean;
  cacheKey?:string|string[];
}

const usePosts = (props?:Prisma.PostFindManyArgs, options?: Options) => {
  const {lang} = useTranslation();
  const { staleTime, enabled, cacheKey } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  let ck = cacheKey ? cacheKey : ['POSTS', `${JSON.stringify(props)}`];
debugger;
  return useQuery<{posts:PostMosaicItem[],fetched:number,total:number}>(ck, () => getPosts(lang,props), {
    staleTime,
    enabled,
    retry:3
  });
};

export default usePosts;
