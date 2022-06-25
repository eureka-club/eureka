import { useQuery } from 'react-query';
// import { useAtom } from 'jotai';
import { PostMosaicItem } from './types/post';
// import globalSearchEngineAtom from './atoms/searchEngine';
import { Prisma } from '@prisma/client';
import { buildUrl } from 'build-url-ts';

export const getPosts = async (
  props?: Prisma.PostFindManyArgs,
): Promise<{posts:PostMosaicItem[],fetched:number,total:number}> => {

  const {where:w,take,skip,cursor:c} = props || {};
  const where = w ? encodeURIComponent(JSON.stringify(w)) : '';
  const cursor = c ? encodeURIComponent(JSON.stringify(c)) : '';

  const url = buildUrl(`${process.env.NEXT_PUBLIC_WEBAPP_URL}/api`, {
    path: 'post',
    queryParams: {
      where,
      take,
      skip,
      cursor,
    }
  });
   
  const res = await fetch(url);

  if (!res.ok) return {posts:[],fetched:0,total:-1};
  const {data:posts,fetched,total} = await res.json();
  return {posts,fetched,total};
};

interface Options {
  staleTime?: number;
  enabled?: boolean;
}

const usePosts = (props?: Prisma.PostFindManyArgs, options?: Options) => {
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  let ck = ['POSTS', `${JSON.stringify(props)}`];

  return useQuery<{posts:PostMosaicItem[],fetched:number,total:number}>(ck, () => getPosts(props), {
    staleTime,
    enabled,
    retry:3
  });
};

export default usePosts;
