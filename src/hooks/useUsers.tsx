import { Prisma } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { UserMosaicItem } from '@/src/types/user';
import { getUsers } from '../actions/user/getUsers';

interface Options {
  staleTime?: number;
  enabled?: boolean;
  from?: string
}

const useUsers = (props: Prisma.UserFindManyArgs, options?: Options) => {
  const { staleTime, enabled, from } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };

  return useQuery<UserMosaicItem[]>({
    queryKey:['USERS', JSON.stringify(props)],
    queryFn: () => getUsers(props),
    staleTime,
    enabled
  });
};

export default useUsers;
