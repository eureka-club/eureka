import { useQuery, useQueryClient } from 'react-query';
import { PostSumary } from './types/post';
import { WEBAPP_URL } from './constants';

export const getPostSumary = async (id: number): Promise<PostSumary | undefined> => {
  if (!id) return undefined;
  const url = `${WEBAPP_URL}/api/post/${id}/sumary`;

  const res = await fetch(url);
  if (!res.ok) return undefined;
  const result = await res.json();
  return result.post;
}

interface Options {
  staleTime?: number;
  enabled?: boolean;
}

const usePostSumary = (id: number, options?: Options) => {
  const qc = useQueryClient()
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true, 
  };
  return useQuery<PostSumary | undefined>(['POST', `${id}`, 'SUMARY'], () => getPostSumary(id), {
    staleTime,
    enabled,
    initialData:()=>{
      return qc.getQueryData<{posts:PostSumary[]}>(['POSTS','eurekas-of-interest'])?.posts.find(p=>p.id==id)
    }
  });
};

export default usePostSumary;

