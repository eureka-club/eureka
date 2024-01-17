import { useQuery } from '@tanstack/react-query';;
import { EditionMosaicItem } from '@/types/edition';
import { Prisma } from '@prisma/client';
import { useParams } from 'next/navigation';
import { WEBAPP_URL } from '../constants';

export const getEditions= async (
  lang:string,
  props?:Prisma.WorkFindManyArgs,
): Promise<{ editions: EditionMosaicItem[],fetched:number,total:number}> => {
  const query = props?`?props=${encodeURIComponent(JSON.stringify(props))}`:''
  const url = `${WEBAPP_URL}/${lang}/api/edition${query}`
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
  const {lang} = useParams<{lang:string}>()!;
  const { staleTime, enabled,cacheKey } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  let ck = cacheKey ? [`${cacheKey}-${JSON.stringify(props)}`] : ['EDITIONS', `${lang}-${JSON.stringify(props)}`];

  return useQuery<{ editions: EditionMosaicItem[], fetched: number, total: number }>(
    {
      queryKey:ck, 
      queryFn:() => getEditions(lang,props),
      staleTime,
      enabled
  });
};

export default useEditions;
