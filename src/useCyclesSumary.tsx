import { useQuery } from 'react-query';
import { Prisma } from '@prisma/client';
import { WEBAPP_URL } from './constants';
import { CycleSumary } from './types/cycle';

export const getCyclesSumary = async (
  lang?:string,
  props?:Prisma.CycleFindManyArgs,
): Promise<{cycles:CycleSumary[],fetched:number,total:number}> => {
  const query = props?`?props=${encodeURIComponent(JSON.stringify(props))}&lang=${lang}`:''
  const url = `${WEBAPP_URL}/api/cycle/sumary${query}`
  const res = await fetch(url);
  if (!res.ok) return {cycles:[],fetched:0,total:-1};
  const {data:cycles,fetched,total} = await res.json();
  return {cycles,fetched,total};
};

interface Options {
  staleTime?: number;
  enabled?: boolean;
  cacheKey?:string[];
}

const useCyclesSumary = (lang?:string,props?:Prisma.CycleFindManyArgs, options?: Options) => {
  const { staleTime, enabled, cacheKey } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  let ck = cacheKey ? cacheKey : ['CYCLES', `${JSON.stringify(props)}`,'SUMARY'];
  return useQuery<{cycles:CycleSumary[],fetched:number,total:number}>(ck, () => getCyclesSumary(lang,props), {
    staleTime,
    enabled,
    retry:3
  });
};

export default useCyclesSumary;
