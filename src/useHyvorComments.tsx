import { useQuery } from 'react-query';
import { WEBAPP_URL } from './constants';

export const getHyvorComments = async (id: string): Promise<any[]> => {
  const url = `${WEBAPP_URL}/api/hyvor_talk/searchComments?id=${id}`;
  const res = await fetch(url);
  const { data: comments } = await res.json();
  if (comments && comments.data)
    return comments.data;
  else
    return [];

};


const useHyvorComments = (id: string) => {
  return useQuery<any[]>(['HYVOR-COMMENTS', id], () => getHyvorComments(id), {
    staleTime: 1000 * 60 * 60,
  });
};

export default useHyvorComments;
