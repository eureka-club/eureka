import { useQuery } from 'react-query';
import { WorkMosaicItem } from './types/work';
import { Prisma } from '@prisma/client';

export const getWorks = async (
  props?:Prisma.WorkFindManyArgs,
  origin=''
): Promise<{works:WorkMosaicItem[],fetched:number,total:number}> => {
  const query = props?`?props=${encodeURIComponent(JSON.stringify(props))}`:''
  const url = `${origin||''}/api/work${query}`
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
  const { staleTime, enabled,cacheKey } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  let ck = cacheKey ? `${cacheKey}-${JSON.stringify(props)}` : ['WORKS', `${JSON.stringify(props)}`];

  return useQuery<{works:WorkMosaicItem[],fetched:number,total:number}>(ck, () => getWorks(props), {
    staleTime,
    enabled
  });
};

export default useWorks;
