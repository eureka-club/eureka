import { Prisma } from '@prisma/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { UserMosaicItem } from '@/src/types/user';
import { buildUrl } from 'build-url-ts';

// import { useAtom } from 'jotai';
// import globalSearchEngineAtom from './atoms/searchEngine';
// import { UserDetail } from '@/src/types/user';
interface Options {
  staleTime?: number;
  enabled?: boolean;
  from?: string
}
export const getUsers = async (props?: Prisma.UserFindManyArgs, origin = ''): Promise<UserMosaicItem[]> => {
  const { where: w, take, skip, cursor: c } = props || {};
  const where = w ? encodeURIComponent(JSON.stringify(w)) : undefined;
  const cursor = c ? encodeURIComponent(JSON.stringify(c)) : undefined;

  const url = buildUrl(`${origin || ''}/api`, {
    path: 'user',
    queryParams: {
      where,
      take,
      skip,
      cursor,
    }
  });

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) return [];

  const { data } = await res.json();
  return data;
};

const useUsers = (where: Prisma.UserFindManyArgs, options?: Options) => {
  const qc = useQueryClient()
  const { staleTime, enabled, from } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };

  return useQuery<UserMosaicItem[]>({
    queryKey:['USERS', JSON.stringify(where)],
    queryFn: () => getUsers(where),
    staleTime,
    enabled
  });
};

export default useUsers;
