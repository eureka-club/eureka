import { useQuery } from '@tanstack/react-query';;
import { UserDetail, UserSumary } from '@/types/user';
import { WEBAPP_URL } from './constants';

export const getUserSumary = async (id: number): Promise<UserDetail|null> => {
  if (!id) return null;
  else{
    // const langQ = language ? `language=${language}` : '';
    const url = `${WEBAPP_URL}/api/user/${id}/sumary`;
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

const useUserSumary = (id: number, options?: Options) => {
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  return useQuery<UserSumary|null>(
    {
     queryKey: ['USER', `${id}`, 'SUMARY'],
      queryFn:() => getUserSumary(id),
    staleTime,
    enabled,
  });
};

export default useUserSumary;
