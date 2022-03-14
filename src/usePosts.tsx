<<<<<<< HEAD
import { Prisma } from '@prisma/client';
import { useQuery } from 'react-query';
import { PostMosaicItem } from './types/post';


export const POST_COUNT = +(process.env.NEXT_PUBLIC_MOSAIC_ITEMS_COUNT || 10);

export const getRecords = async (where?:Prisma.PostWhereInput,page?: number): Promise<PostMosaicItem[]> => {
  
  const w = encodeURIComponent(JSON.stringify(where))
  const url = `/api/post?take=${POST_COUNT}&page=${page}&where=${w}`;

  const res = await fetch(url);
  if (!res.ok) return [];
  const {data:posts,hasNextPage} = await res.json();
  posts.forEach((p:PostMosaicItem) => {
    p.type = 'post'
  });
  return posts;
=======
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
  url = `/api/post${where ? `?where=${w}` : ''}`;
   
  const res = await fetch(url);
  if (!res.ok) return [];
  const result = await res.json();debugger;
  return result.data;
>>>>>>> develop
};

interface Options {
  staleTime?: number;
  enabled?: boolean;
}

<<<<<<< HEAD


const usePostsPaginated = (where?:Prisma.PostWhereInput,page?: number,options?:Options) => {
=======
const usePosts = (where?: Prisma.PostWhereInput, options?: Options) => {
>>>>>>> develop
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
<<<<<<< HEAD
  return useQuery<PostMosaicItem[]>(['POSTS', JSON.stringify(where)], ()=> getRecords(where,page),{
    staleTime,
    enabled
  });
};

export default usePostsPaginated

=======
  let ck = ['POSTS', `${JSON.stringify(where)}`];

  return useQuery<PostMosaicItem[]>(ck, () => getPosts(where), {
    staleTime,
    enabled,
  });
};

export default usePosts;
>>>>>>> develop
