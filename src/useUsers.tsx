import { Prisma } from '@prisma/client';
import { useQuery, useQueryClient } from 'react-query';
import { UserMosaicItem } from './types/user';
// import { useAtom } from 'jotai';
// import globalSearchEngineAtom from './atoms/searchEngine';
// import { UserDetail } from './types/user';
interface Options {
  staleTime?: number;
  enabled?: boolean;
  from?:string
}
export const getUsers = async (where:Prisma.UserWhereInput):Promise<UserMosaicItem[]> => {
  const w = encodeURIComponent(JSON.stringify(where));
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBAPP_URL}/api/user?where=${w}`);
  if(!res.ok)return [];
  const {data} = await res.json();
 // console.log(data)
  return data;
};

const useUsers = (where:Prisma.UserWhereInput,options?: Options) => {
  const qc = useQueryClient()
  const { staleTime, enabled,from } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  const prev = qc.getQueryData(['USERS', JSON.stringify(where)])
  // console.log(prev,from,new Date())
  return useQuery<UserMosaicItem[]>(['USERS', JSON.stringify(where)], () => getUsers(where), {
    staleTime,
    enabled
  });
};

export default useUsers;
