import { useQuery } from 'react-query';
import { CommentMosaicItem } from './types/comment';

const fetchComment = async (id: string) => {
  if (!id) return null;
  const res = await fetch(`/api/comment/${id}`);
  const json = await res.json();
  return json.comment;
};

const useComment = (id: string) => {
  return useQuery<CommentMosaicItem>(['COMMENT', id], () => fetchComment(id), {
    staleTime: 1000 * 60 * 60,
  });
};

export { useComment, fetchComment };
