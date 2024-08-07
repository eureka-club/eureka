import { useQuery } from 'react-query';
import { EditionMosaicItem } from './types/edition';
import { Prisma } from '@prisma/client';
import useTranslation from 'next-translate/useTranslation';

export const getEditions= async (
  lang:string,
  props?:Prisma.WorkFindManyArgs,
  origin='',
): Promise<{ editions: EditionMosaicItem[],fetched:number,total:number}> => {
  const query = props?`?lang=${lang}&props=${encodeURIComponent(JSON.stringify(props))}`:''
  const url = `${origin||''}/api/edition${query}`
  const res = await fetch(url);
  if (!res.ok) return {editions:[],fetched:0,total:-1};
  const { data: editions,fetched,total} = await res.json();
  return { editions,fetched,total};
};

interface Options {
  staleTime?: number;
  enabled?: boolean;
  cacheKey?:string|string[];
}
const useEditions = (props?:Prisma.WorkFindManyArgs,options?: Options) => {
  const {lang} = useTranslation();
  const { staleTime, enabled,cacheKey } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  let ck = cacheKey ? `${cacheKey}-${JSON.stringify(props)}` : ['EDITIONS', `${lang}-${JSON.stringify(props)}`];

  return useQuery<{ editions: EditionMosaicItem[], fetched: number, total: number }>(ck, () => getEditions(lang,props), {
    staleTime,
    enabled
  });
};

export default useEditions;
