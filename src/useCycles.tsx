import { CycleSumary } from './types/cycle';
import { Prisma } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export const getCycles = async (
  lang?:string,
  props?:Prisma.CycleFindManyArgs,
  origin=''
): Promise<{cycles:CycleSumary[],fetched:number,total:number}> => {
  const query = props?`?props=${encodeURIComponent(JSON.stringify(props))}&lang=${lang}`:''
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
  const params=useParams<{lang:string}>();
  const lang = params?.lang!;

  const { staleTime, enabled, cacheKey } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  let ck = cacheKey ? [`${cacheKey}-${JSON.stringify(props)}`] : ['CYCLES', `${JSON.stringify(props)}`];

  return useQuery<{cycles:CycleSumary[],fetched:number,total:number}>(
    {
        queryKey:ck,
        queryFn: () => getCycles(lang,props),
    staleTime,
    enabled,
    retry:3
  });
};

export default useCycles;
