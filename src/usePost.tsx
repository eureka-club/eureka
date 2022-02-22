import { useQuery,QueryClient } from 'react-query';
import { MosaicItem } from './types';
import { PostMosaicItem } from './types/post';

export const getRecord = async (id: number): Promise<PostMosaicItem | undefined> => {debugger;
  if (!id) return undefined;
  const url = `/api/post/${id}`;

  const res = await fetch(url);
  if (!res.ok) return undefined;
  const result = await res.json();

  return result.post ? { ...result.post, type: 'post' } : undefined;
};

export const prefetchPost = async (id:number,queryClient:QueryClient):Promise<void> => {
  return queryClient.prefetchQuery(['POST',`${id}`], async ()=> getRecord(id))
}

interface Options {
  staleTime?: number;
  enabled?: boolean;
}

export const usePost = (id: number, options?: Options) => {
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  return useQuery<PostMosaicItem | undefined>(['POST', `${id}`], () => getRecord(id), {
    staleTime,
    enabled,
  });
};

