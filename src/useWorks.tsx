import { useQuery } from 'react-query';
import { WorkMosaicItem } from './types/work';
import { Prisma } from '@prisma/client';
import useTranslation from 'next-translate/useTranslation';

export const getWorks = async (
  language?: string,
  props?: Prisma.WorkFindManyArgs,
  origin = '',
): Promise<{ works: WorkMosaicItem[], fetched: number, total: number }> => {
  let query = props ? `?props=${encodeURIComponent(JSON.stringify(props))}` : ''  //language=${language}&
  
  if (language)
    query += `&language=${language}`;
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
const useWorks = (props?: Prisma.WorkFindManyArgs, options?: Options,languages?:string) => {
  // const { lang } = useTranslation();
  const { staleTime, enabled, cacheKey, notLangRestrict } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };

  let ck = (cacheKey || notLangRestrict) ? `${cacheKey}-${JSON.stringify(props)}` : ['WORKS', `${languages}-${JSON.stringify(props)}`];

  return useQuery<{ works: WorkMosaicItem[], fetched: number, total: number }>(ck, () => getWorks(!notLangRestrict ? languages : undefined, props), {
    staleTime,
    enabled
  });
};

export default useWorks;
