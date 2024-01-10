import { useQuery } from '@tanstack/react-query';
import { CycleMosaicItem } from '@/src/types/cycle';
import { Prisma } from '@prisma/client';

export const getCycles = async (
  langs:string,
  props?:Prisma.CycleFindManyArgs,
  origin=''
): Promise<{cycles:CycleMosaicItem[],fetched:number,total:number}> => {
  const query = props?`?lang=${langs}&props=${encodeURIComponent(JSON.stringify(props))}`:''
  const url = `${origin||''}/api/cycle${query}`
  const res = await fetch(url);
  if (!res.ok) return {cycles:[],fetched:0,total:-1};
  const {data:cycles,fetched,total} = await res.json();
  return {cycles,fetched,total};
};

interface Options {
  staleTime?: number;
  enabled?: boolean;
  cacheKey?:string|string[];
}

const useCycles = (lang: string = 'pt',props?:Prisma.CycleFindManyArgs, options?: Options) => {
  const { staleTime, enabled, cacheKey } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  let ck = cacheKey ? [`${cacheKey}-${JSON.stringify(props)}`] : ['CYCLES', `${JSON.stringify(props)}`];

  return useQuery<{cycles:CycleMosaicItem[],fetched:number,total:number}>({
    queryKey:ck, 
    queryFn:() => getCycles(lang,props), 
    staleTime,
    enabled,
    retry:3
  });
};

export default useCycles;
