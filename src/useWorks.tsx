import { useQuery } from 'react-query';
import { WorkMosaicItem } from './types/work';
import { Prisma } from '@prisma/client';

export const getWorks = async (
  where?: Prisma.WorkWhereInput
): Promise<WorkMosaicItem[]> => {
  const w = encodeURIComponent(JSON.stringify(where))   
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBAPP_URL}/api/work${where ? `?where=${w}` : ''}`);
  if (!res.ok) return [];
  const {data} = await res.json();
  return data;
};

interface Options {
  staleTime?: number;
  enabled?: boolean;
}
const useWorks = (where?: Prisma.WorkWhereInput,options?: Options) => {
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  return useQuery<WorkMosaicItem[]>(["WORKS",`${JSON.stringify(where)}`], () => getWorks(where), {
    staleTime,
    enabled
  });
};

export default useWorks;
