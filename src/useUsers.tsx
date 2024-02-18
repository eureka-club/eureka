import { Prisma } from '@prisma/client';
import { useQuery } from 'react-query';
import { buildUrl } from 'build-url-ts';
import { WEBAPP_URL } from './constants';
import { UserSumary } from './types/UserSumary';

// import { useAtom } from 'jotai';
// import globalSearchEngineAtom from './atoms/searchEngine';
// import { UserDetail } from './types/user';
interface Options {
  staleTime?: number;
  enabled?: boolean;
  from?:string;
  cacheKey?:string[];
}
export const getUsers = async (props?:Prisma.UserFindManyArgs):Promise<UserSumary[]> => {
  const {where:w,take,skip,cursor:c} = props || {};
  const where = w ? encodeURIComponent(JSON.stringify(w)) : '';
  const cursor = c ? encodeURIComponent(JSON.stringify(c)) : '';

  const url = buildUrl(`${WEBAPP_URL}/api`, {
    path: 'user',
    queryParams: {
      where,
      take,
      skip,
      cursor,
    }
  });

  const res = await fetch(url!);
  if(!res.ok)return [];
  const {data} = await res.json();
  return data;
};

const useUsers = (where:Prisma.UserFindManyArgs,options?: Options) => {
  const { staleTime, enabled,from,cacheKey } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  const ck = cacheKey ?? ['USERS', JSON.stringify(where)];
  return useQuery<UserSumary[]>(ck, () => getUsers(where), {
    staleTime,
    enabled
  });
};

export default useUsers;
