import { useQuery } from 'react-query';
import { UserMosaicItem } from '@/types/user';
import { PostMosaicItem } from './types/post';
// import { UserDetail } from '@/types/user';
// import { User } from '@prisma/client';


export const getRecord = async (id: string): Promise<UserMosaicItem|undefined> => {
  if (!id) return undefined;
  else{
    const url = `/api/user/${id}`;
    const res = await fetch(url);
    if (!res.ok) return undefined;
    return res.json();
   }
};


interface Options {
  staleTime?: number;
  enabled?: boolean;
}

const useUser = (id: string, options?: Options) => {
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  return useQuery<UserMosaicItem|undefined>(['USER', `${id}`], () => getRecord(id), {
    staleTime,
    enabled,
  });
};

export default useUser;
