import { useQuery } from 'react-query';
import { PostMosaicItem } from './types/post';
import { Prisma } from '@prisma/client';
import { buildUrl } from 'build-url-ts';

export const getPosts = async (
  q?:string,
  props?: Prisma.PostFindManyArgs,
): Promise<{posts:PostMosaicItem[],fetched:number,total:number}> => {

  const url = buildUrl(`${process.env.NEXT_PUBLIC_WEBAPP_URL}/api`, {
    path: 'post',
    queryParams: {
      q,
      props:encodeURIComponent(JSON.stringify(props||{}))
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

const usePosts = (q?:string,props?: Prisma.PostFindManyArgs, options?: Options) => {
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  let ck = ['POSTS', `${JSON.stringify(props)}`];

  return useQuery<{posts:PostMosaicItem[],fetched:number,total:number}>(ck, () => getPosts(q,props), {
    staleTime,
    enabled,
    retry:3
  });
};

export default usePosts;
