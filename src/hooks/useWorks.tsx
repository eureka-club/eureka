import { WorkMosaicItem } from '@/src/types/work';
import { Prisma } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useDictContext } from './useDictContext';

export const getWorks = async (
  langs?: string,
  props?: Prisma.WorkFindManyArgs,
  origin = '',
): Promise<{ works: WorkMosaicItem[], fetched: number, total: number }> => {
  let query = props ? `?props=${encodeURIComponent(JSON.stringify(props))}` : ''  //lang=${lang}&
  if (langs)
    query += `&lang=${langs}`;
  const url = `${origin || ''}/api/work${query}`
  const res = await fetch(url,{cache: 'no-store'});
  if (!res.ok) return { works: [], fetched: 0, total: -1 };
  const { data: works, fetched, total } = await res.json();
  return { works, fetched, total };
};

interface Options {
  staleTime?: number;
  enabled?: boolean;
  notLangRestrict?: boolean | undefined;
  cacheKey?: string | string[];
}
const useWorks = (props?: Prisma.WorkFindManyArgs, options?: Options) => {
  const { staleTime, enabled, cacheKey, notLangRestrict } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  const{langs}=useDictContext()
  
  let ck = (cacheKey || notLangRestrict) ? [`${cacheKey}-${JSON.stringify(props)}`] : ['WORKS', `${langs}-${JSON.stringify(props)}`];

  return useQuery<{ works: WorkMosaicItem[], fetched: number, total: number }>({
    queryKey:ck,
    queryFn: () => getWorks(!notLangRestrict ? langs : undefined, props), 
    staleTime,
    enabled
  });
};

export default useWorks;
