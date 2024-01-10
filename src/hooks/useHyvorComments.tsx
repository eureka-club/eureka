import { useQuery } from "@tanstack/react-query";
// import { buildUrl } from 'build-url-ts';
// import { Country } from './types';

export const getHyvorComments = async (id: string, origin?: string): Promise<any[]> => {
  const url = `${origin || ''}/api/hyvor_talk?id=${id}`;
  const res = await fetch(url);
  const { data: comments } = await res.json();
  if (comments && comments.data)
    return comments.data;
  else
    return [];

};

const useHyvorComments = (id: string) => {
  return useQuery<any[]>({
    queryKey:['HYVOR-COMMENTS', id], 
    queryFn:() => getHyvorComments(id), 
    staleTime: 1000 * 60 * 60,
  });
};

export default useHyvorComments;
