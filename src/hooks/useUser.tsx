"use client"
import { useQuery } from '@tanstack/react-query';
import { UserMosaicItem } from '@/src/types/user';

export const getUser = async (id: number,origin='',language?:string): Promise<UserMosaicItem|null> => {
  if (!id) return null;
  else{
    const langQ = language ? `language=${language}` : '';
    const url = `${origin||''}/api/user/${id}?${langQ}`;
    const fr = await fetch(url);
    if (fr.ok){
      const {user} = await fr.json();
      return {...user,type:'user'};
    }
    return null;
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
  return useQuery<UserMosaicItem|null>({
    queryKey:['USER', `${id}`],
    queryFn:() => getUser(id,''),
    staleTime,
    enabled,
  });
};

export default useUser;
