import { useQuery } from 'react-query';
import { PostMosaicItem } from './types/post';

export const getRecord = async (id: number): Promise<PostMosaicItem | undefined> => {
  if (!id) return undefined;
  const url = `/api/post/${id}`;

  const res = await fetch(url);
  if (!res.ok) return undefined;
  const result = await res.json();

  return result.post ? { ...result.post, type: 'post' } : undefined;
};

interface Options {
  staleTime?: number;
  enabled?: boolean;
}

const usePost = (id: number, options?: Options) => {
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  return useQuery<PostMosaicItem | undefined>(['POST', `${id}`], () => getRecord(id), {
    staleTime,
    enabled,
  });
};

export default usePost;
