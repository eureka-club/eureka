"use client"
import { useQuery } from '@tanstack/react-query';
import { PostMosaicItem } from '../types/post';
// import GetPosts from '@/src/actions/GetPosts';

interface Options {
  staleTime?: number;
  enabled?: boolean;
}
export const getCyclePosts = async (id:number)=>{
  const url = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/api/cycle/${id}/posts`;
  const fr = await fetch(url);
  const posts = fr.ok? await fr.json() as PostMosaicItem[] : [];
  return posts;
}
const useCyclePosts = (id: number, options?: Options) => {
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  return useQuery<PostMosaicItem[] | undefined>({
    queryKey:['CYCLE', `${id}`,'POSTS'], 
    queryFn:async ()=> await getCyclePosts(id),
    staleTime,
    enabled,
  });
};

export default useCyclePosts;
