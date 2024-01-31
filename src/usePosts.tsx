import { useQuery } from '@tanstack/react-query';;
import { PostMosaicItem } from './types/post';
import { Prisma } from '@prisma/client';
import { useParams } from 'next/navigation';

// import { buildUrl } from 'build-url-ts';

export const getPosts = async (
  lang?:string,
  props?:Prisma.PostFindManyArgs,
  origin=''
): Promise<{posts:PostMosaicItem[],fetched:number,total:number}> => {
  const query = props?`?props=${encodeURIComponent(JSON.stringify(props))}&lang=${lang}`:''
  const url = `${origin||''}/api/post${query}`
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
  const {lang} = useParams<{lang:string}>()!;
  const { staleTime, enabled, cacheKey } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  let ck = cacheKey ? [cacheKey] : ['POSTS', `${JSON.stringify(props)}`];

  return useQuery<{posts:PostMosaicItem[],fetched:number,total:number}>(
    {
        queryKey:ck,
         queryFn:() => getPosts(lang,props),
    staleTime,
    enabled,
    retry:3
  });
};

export default usePosts;
