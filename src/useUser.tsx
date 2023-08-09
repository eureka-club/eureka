import { useQuery } from 'react-query';
import { UserMosaicItem } from '@/types/user';
import { useRouter } from 'next/router';

export const getUser = async (id: number,origin='',language?:string): Promise<UserMosaicItem|null> => {
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
  const router = useRouter();
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  return useQuery<UserMosaicItem|null>(['USER', `${id}`], () => getUser(id,''), {
    staleTime,
    enabled,
  });
};

export default useUser;
