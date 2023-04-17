import { useQuery } from 'react-query';
import { CycleMosaicItem } from './types/cycle';
import { Prisma } from '@prisma/client';

export const getCycles = async (
  props?:Prisma.CycleFindManyArgs,
  origin=''
): Promise<{cycles:CycleMosaicItem[],fetched:number,total:number}> => {
  const query = props?`?props=${encodeURIComponent(JSON.stringify(props))}`:''
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

const useCycles = (props?:Prisma.CycleFindManyArgs, options?: Options) => {
  const { staleTime, enabled, cacheKey } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  let ck = cacheKey ? `${cacheKey}-${JSON.stringify(props)}` : ['CYCLES', `${JSON.stringify(props)}`];

  return useQuery<{cycles:CycleMosaicItem[],fetched:number,total:number}>(ck, () => getCycles(props), {
    staleTime,
    enabled,
    retry:3
  });
};

export default useCycles;
