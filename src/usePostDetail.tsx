import { useQuery, useQueryClient } from 'react-query';
import { PostDetail } from './types/post';
import { WEBAPP_URL } from './constants';
import { useSession } from 'next-auth/react';

export const getPostDetail = async (id: number,sessionId:number|null): Promise<PostDetail | undefined> => {
  if (!id) return undefined;
  const url = `${WEBAPP_URL}/api/post/detail`;
  const res = await fetch(url,{
    method:'POST',
    body:JSON.stringify({
      id,
      sessionId
    }),
    headers:{
      'Content-Type':"application/json"
    }
  });
  if (!res.ok) return undefined;
  const result = await res.json();
  return result.post;
}

interface Options {
  staleTime?: number;
  enabled?: boolean;
}

const usePostDetail = (id: number, options?: Options) => {
  const {data:session} = useSession();
  const qc = useQueryClient()
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true, 
  };
  return useQuery<PostDetail | undefined>(['POST', `${id}`], () => getPostDetail(id,session?.user.id!), {
    staleTime,
    enabled,
    initialData:()=>{
      return qc.getQueryData<{posts:PostDetail[]}>(['POSTS','eurekas-of-interest'])?.posts.find(p=>p.id==id)
    }
  });
};

export default usePostDetail;

