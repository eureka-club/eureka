import { useQuery } from 'react-query';
import { buildUrl } from 'build-url-ts';
import { Country } from './types';


const getHyvorComments = async (id: string): Promise<any[]> => {
  const url = `/api/hyvor_talk/searchComments?id=${id}`;
  const res = await fetch(url);
  const { data: comments} = await res.json();
  return  comments.data;
};


const useHyvorComments = (id: string) => {
   return useQuery<any[]>(['HYVOR-COMMENTS', id], () => getHyvorComments(id), {
     staleTime: 1000 * 60 * 60,
   });
};

export default useHyvorComments;
