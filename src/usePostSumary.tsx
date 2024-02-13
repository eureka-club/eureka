import { useQuery, useQueryClient } from 'react-query';
import { PostSumary } from './types/post';
import { WEBAPP_URL } from './constants';
import { useSession } from 'next-auth/react';

export const getPostSumary = async (id: number,sessionId:number|null): Promise<PostSumary | null> => {
  if (!id) return null;
  const url = `${WEBAPP_URL}/api/post/${id}/sumary`;

  const res = await fetch(url,{
    method:'POST',
    body:JSON.stringify({
      id,
      sessionId
    }),
    headers:{
      'Content-type':'application/json'
    }
  });
  if (!res.ok) return null;
  const result = await res.json();debugger;
  return result.post;
}

interface Options {
  staleTime?: number;
  enabled?: boolean;
  cacheKey?:string[];
}

const usePostSumary = (id: number, options?: Options) => {
  const{data:session}=useSession();
  const { staleTime, enabled, cacheKey } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true, 
  };
  const ck = cacheKey ?? ['POST', `${id}`, 'SUMARY']; 
  return useQuery<PostSumary | null>(ck, () => getPostSumary(id,session?.user.id!), {
    staleTime,
    enabled,
    // initialData:()=>{
    //   return qc.getQueryData<{posts:PostSumary[]}>(['POSTS','eurekas-of-interest'])?.posts.find(p=>p.id==id)
    // }
  });
};

export default usePostSumary;

