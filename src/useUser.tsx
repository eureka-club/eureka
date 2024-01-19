import { useQuery } from '@tanstack/react-query';;
import { UserDetail } from '@/types/user';

export const getUser = async (id: number,origin='',language?:string): Promise<UserDetail|null> => {
  if (!id) return null;
  else{
    const langQ = language ? `language=${language}` : '';
    const url = `${origin||''}/api/user/${id}?${langQ}`;
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
  return useQuery<UserDetail|null>(
    {
     queryKey: ['USER', `${id}`],
      queryFn:() => getUser(id,''),
    staleTime,
    enabled,
  });
};

export default useUser;
