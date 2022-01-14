import { useQuery } from 'react-query';
import { UserMosaicItem } from '@/types/user';
import { PostMosaicItem } from './types/post';
// import { UserDetail } from '@/types/user';
// import { User } from '@prisma/client';


export const getRecord = async (id: number): Promise<UserMosaicItem|null> => {
  if (!id) return null;
  else{
    const url = `/api/user/${id}`;
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
  return useQuery<UserMosaicItem|null>(['USER', `${id}`], () => getRecord(id), {
    staleTime,
    enabled,
  });
};

export default useUser;
