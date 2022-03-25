import { Prisma } from '@prisma/client';
import { useQuery } from 'react-query';
import { UserMosaicItem } from './types/user';
// import { useAtom } from 'jotai';
// import globalSearchEngineAtom from './atoms/searchEngine';
// import { UserDetail } from './types/user';
interface Options {
  staleTime?: number;
  enabled?: boolean;
}
export const getUsers = async (where:Prisma.UserWhereInput):Promise<UserMosaicItem[]> => {
  const w = encodeURIComponent(JSON.stringify(where));
  const res = await fetch(`/api/user?where=${w}`);
  if(!res.ok)return [];
  const {data} = await res.json();
  return data;
};

const useUsers = (where:Prisma.UserWhereInput,options?: Options) => {
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  return useQuery<UserMosaicItem[]>(['USERS', JSON.stringify(where)], () => getUsers(where), {
    staleTime,
    enabled
  });
};

export default useUsers;
