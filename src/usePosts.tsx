import { useQuery } from 'react-query';
// import { useAtom } from 'jotai';
import { PostMosaicItem } from './types/post';
// import globalSearchEngineAtom from './atoms/searchEngine';
import { Prisma } from '@prisma/client';

export const getPosts = async (
  where?: Prisma.PostWhereInput,
): Promise<PostMosaicItem[]> => {
  
  let url = '';
  const w = encodeURIComponent(JSON.stringify(where))
  url = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/api/post${where ? `?where=${w}` : ''}`;
   
  const res = await fetch(url);
  if (!res.ok) return [];
  const result = await res.json();
  return result.data;
};

interface Options {
  staleTime?: number;
  enabled?: boolean;
}

const usePosts = (where?: Prisma.PostWhereInput, options?: Options) => {
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  let ck = ['POSTS', `${JSON.stringify(where)}`];

  return useQuery<PostMosaicItem[]>(ck, () => getPosts(where), {
    staleTime,
    enabled,
    retry:3
  });
};

export default usePosts;
