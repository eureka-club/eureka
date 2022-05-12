import { useQuery,QueryClient } from 'react-query';
import { MosaicItem } from './types';
import { PostMosaicItem } from './types/post';

export const getPost = async (id: number): Promise<PostMosaicItem | undefined> => {
  if (!id) return undefined;
  const url = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/api/post/${id}`;

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
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  return useQuery<PostMosaicItem | undefined>(['POST', `${id}`], () => getPost(id), {
    staleTime,
    enabled,
  });
};

export default usePost;

