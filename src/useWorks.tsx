import { useQuery } from 'react-query';
import { WorkMosaicItem } from './types/work';
import { Prisma } from '@prisma/client';
import useTranslation from 'next-translate/useTranslation';

export const getWorks = async (
  lang:string,
  props?:Prisma.WorkFindManyArgs,
  origin='',
): Promise<{works:WorkMosaicItem[],fetched:number,total:number}> => {
  const query = props?`?lang=${lang}&props=${encodeURIComponent(JSON.stringify(props))}`:''
  const url = `${origin||''}/api/work${query}`
  console.log(url)
  const res = await fetch(url);
  if (!res.ok) return {works:[],fetched:0,total:-1};
  const {data:works,fetched,total} = await res.json();
  return {works,fetched,total};
};

interface Options {
  staleTime?: number;
  enabled?: boolean;
  cacheKey?:string|string[];
}
const useWorks = (props?:Prisma.WorkFindManyArgs,options?: Options) => {
  const {lang} = useTranslation();
  const { staleTime, enabled,cacheKey } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  let ck = cacheKey ? `${cacheKey}-${JSON.stringify(props)}` : ['WORKS', `${lang}-${JSON.stringify(props)}`];

  return useQuery<{works:WorkMosaicItem[],fetched:number,total:number}>(ck, () => getWorks(lang,props), {
    staleTime,
    enabled
  });
};

export default useWorks;
