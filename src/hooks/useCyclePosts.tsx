"use client"
import { useQuery } from '@tanstack/react-query';
import { PostMosaicItem } from '@/src/types/post';
import { getCyclePosts } from '../actions/cycle/getCyclePosts';
// import GetPosts from '@/src/actions/GetPosts';

interface Options {
  staleTime?: number;
  enabled?: boolean;
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
