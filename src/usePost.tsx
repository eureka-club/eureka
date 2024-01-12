import { useQuery, useQueryClient } from '@tanstack/react-query';;
import { PostMosaicItem } from './types/post';

export const getPost = async (id: number,origin=''): Promise<PostMosaicItem | undefined> => {
  if (!id) return undefined;
  const url = `${origin||''}/api/post/${id}`;

  const res = await fetch(url);
  if (!res.ok) return undefined;
  const result = await res.json();
  return result.post;
}

interface Options {
  staleTime?: number;
  enabled?: boolean;
}

const usePost = (id: number, options?: Options) => {
  const qc = useQueryClient()
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true, 
  };
  return useQuery<PostMosaicItem | undefined>(
    {
       queryKey:['POST', `${id}`],
        queryFn:() => getPost(id), 
    staleTime,
    enabled,
    initialData:()=>{
      return qc.getQueryData<{posts:PostMosaicItem[]}>(['POSTS','eurekas-of-interest'])?.posts.find(p=>p.id==id)
    }
  });
};

export default usePost;

