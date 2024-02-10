import { useQuery } from 'react-query';
import { Prisma } from '@prisma/client';
import useTranslation from 'next-translate/useTranslation';
import { WorkDetail } from './types/work';
import { WEBAPP_URL } from './constants';

export const getWorksDetail = async (
  lang?: string,
  props?: Prisma.WorkFindManyArgs,
): Promise<{ works: WorkDetail[], fetched: number, total: number }> => {
  let query = props ? `?props=${encodeURIComponent(JSON.stringify(props))}` : ''  //lang=${lang}&
  if (lang)
    query += `&lang=${lang}`;
  const url = `${WEBAPP_URL}/api/work${query}`
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
const useWorksDetail = (props?: Prisma.WorkFindManyArgs, options?: Options) => {
  const { lang } = useTranslation();
  const { staleTime, enabled, cacheKey, notLangRestrict } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };

  let ck = (cacheKey || notLangRestrict) ? `${cacheKey}-${JSON.stringify(props)}` : ['WORKS', `${lang}-${JSON.stringify(props)}`];

  return useQuery<{ works: WorkDetail[], fetched: number, total: number }>(ck, () => getWorksDetail(!notLangRestrict ? lang : undefined, props), {
    staleTime,
    enabled
  });
};

export default useWorksDetail;
