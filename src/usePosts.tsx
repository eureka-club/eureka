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
};

interface Options {
  staleTime?: number;
  enabled?: boolean;
}



const usePostsPaginated = (where?:Prisma.PostWhereInput,page?: number,options?:Options) => {
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  return useQuery<PostMosaicItem[]>(['POSTS', JSON.stringify(where)], ()=> getRecords(where,page),{
    staleTime,
    enabled
  });
};

export default usePostsPaginated

