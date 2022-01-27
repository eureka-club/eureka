import { useQuery } from 'react-query';
import { CommentMosaicItem } from './types/comment';

interface Options {
  staleTime?: number;
  enabled?: boolean;
}

const fetchComment = async (id: number) => {
  if (!id) return undefined;
  const res = await fetch(`/api/comment/${id}`);
  if(!res.ok)return undefined;
  const json = await res.json();
  return json.comment;
};

const useComment = (id: number, options?: Options) => {
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  return useQuery<CommentMosaicItem>(['COMMENT', id], () => fetchComment(id), {
    staleTime,
    enabled
  });
};

export { useComment, fetchComment };
