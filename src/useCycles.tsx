import { useQuery } from 'react-query';
import { CycleMosaicItem } from './types/cycle';
import { Prisma } from '@prisma/client';
// import { buildUrl } from 'build-url-ts';

export const getCycles = async (
  props?:Prisma.CycleFindManyArgs,
): Promise<{cycles:CycleMosaicItem[],fetched:number,total:number}> => {
  const query = props?`?props=${encodeURIComponent(JSON.stringify(props))}`:''

  const url = `/api/cycle${query}`
  // const url = buildUrl(`${process.env.NEXT_PUBLIC_WEBAPP_URL}/api`, {
  //   path: 'cycle',
  //   queryParams: {
  //     ...props && {props:encodeURIComponent(JSON.stringify(props))}
  //   }
  // });
   
  const res = await fetch(url);

  if (!res.ok) return {cycles:[],fetched:0,total:-1};
  const {data:cycles,fetched,total} = await res.json();
  return {cycles,fetched,total};
};

interface Options {
  staleTime?: number;
  enabled?: boolean;
}

const useCycles = (props?:Prisma.CycleFindManyArgs, options?: Options) => {
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  const key = JSON.stringify(props); 
  let ck = ['CYCLES', `${key}`];

  return useQuery<{cycles:CycleMosaicItem[],fetched:number,total:number}>(ck, () => getCycles(props), {
    staleTime,
    enabled,
    retry:3
  });
};

export default useCycles;
