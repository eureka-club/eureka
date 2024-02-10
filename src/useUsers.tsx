import { Prisma } from '@prisma/client';
import { useQuery, useQueryClient } from 'react-query';
import { UserDetail, UserSumary } from './types/user';
import { buildUrl } from 'build-url-ts';
import { WEBAPP_URL } from './constants';

// import { useAtom } from 'jotai';
// import globalSearchEngineAtom from './atoms/searchEngine';
// import { UserDetail } from './types/user';
interface Options {
  staleTime?: number;
  enabled?: boolean;
  from?:string
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
  const qc = useQueryClient()
  const { staleTime, enabled,from } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  
  return useQuery<UserSumary[]>(['USERS', JSON.stringify(where)], () => getUsers(where), {
    staleTime,
    enabled
  });
};

export default useUsers;
