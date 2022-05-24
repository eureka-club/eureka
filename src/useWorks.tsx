import { useQuery } from 'react-query';
import { WorkMosaicItem } from './types/work';
import { Prisma } from '@prisma/client';
import { buildUrl } from 'build-url-ts';

export const getWorks = async (
  props?:Prisma.WorkFindManyArgs
): Promise<WorkMosaicItem[]> => {
  const {where:w, take:t, skip:s, cursor:c} = props||{};
  
  const where = w ? encodeURIComponent(JSON.stringify(w)) : '';
  const cursor = c ? encodeURIComponent(JSON.stringify(c)) : '';
  const take = t ? t : ''
  const skip = s ? s : ''

  const url = buildUrl(`${process.env.NEXT_PUBLIC_WEBAPP_URL}/api`, {
    path: 'work',
    queryParams: {
      where,
      take,
      skip,
      cursor,
    }
  });

  const res = await fetch(url);
  if (!res.ok) return [];
  const {data} = await res.json();
  return data;
};

interface Options {
  staleTime?: number;
  enabled?: boolean;
}
const useWorks = (props?:Prisma.WorkFindManyArgs,options?: Options) => {
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  const {where,take,skip,cursor} = props || {};
  const key = `where:${JSON.stringify(where)}|take:${take}|skip:${skip}|cursor:${JSON.stringify(cursor)}`
  return useQuery<WorkMosaicItem[]>(["WORKS",key], () => getWorks(props), {
    staleTime,
    enabled
  });
};

export default useWorks;
