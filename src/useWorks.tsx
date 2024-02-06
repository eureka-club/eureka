import { useQuery } from 'react-query';
import { WorkDetail } from './types/work';
import { Prisma } from '@prisma/client';
import { useParams } from 'next/navigation';


export const getWorks = async (
  lang?: string,
  props?: Prisma.WorkFindManyArgs,
  origin = '',
): Promise<{ works: WorkDetail[], fetched: number, total: number }> => {
  let query = props ? `?props=${encodeURIComponent(JSON.stringify(props))}` : ''  //lang=${lang}&
  if (lang)
    query += `&lang=${lang}`;
  const url = `${origin || ''}/api/work${query}`
  const res = await fetch(url);
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
  const { lang } = useParams<{lang:string}>()!;
  const { staleTime, enabled, cacheKey, notLangRestrict } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };

  let ck = (cacheKey || notLangRestrict) ? [`${cacheKey}-${JSON.stringify(props)}`] : ['WORKS', `${lang}-${JSON.stringify(props)}`];

  return useQuery<{ works: WorkDetail[], fetched: number, total: number }>(
    {
        queryKey:ck,
         queryFn:() => getWorks(!notLangRestrict ? lang : undefined, props),
    staleTime,
    enabled
  });
};

export default useWorks;
