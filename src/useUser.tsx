import { useQuery } from 'react-query';
import { UserDetail } from '@/types/user';
import { WEBAPP_URL } from './constants';

export const getUser = async (id: number,language?:string): Promise<UserDetail|null> => {
  if (!id) return null;
  else{
    const langQ = language ? `language=${language}` : '';
    const url = `${WEBAPP_URL}/api/user/${id}${langQ?`?${langQ}`:''}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const result = await res.json();
    return result.user;
   }
};


interface Options {
  staleTime?: number;
  enabled?: boolean;
}

const useUser = (id: number, options?: Options) => {
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  return useQuery<UserDetail|null>(['USER', `${id}`], () => getUser(id), {
    staleTime,
    enabled,
  });
};

export default useUser;
