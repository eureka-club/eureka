"use client"
import { useQuery } from '@tanstack/react-query';
import { PostMosaicItem } from '../types/post';
// import GetPosts from '@/src/actions/GetPosts';

interface Options {
  staleTime?: number;
  enabled?: boolean;
}
export const getCyclePosts = async (id:number):Promise<PostMosaicItem[]>=>{
  const url = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/cycle/${id}/posts`;
  const fr = await fetch(url);
  if(fr.ok){
    const {posts} = await fr.json();
    return posts.map((p:PostMosaicItem)=>({...p,type:'post'}));
  };
  return [];
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
