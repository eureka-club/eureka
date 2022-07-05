import { useQuery } from 'react-query';
import { WorkMosaicItem } from './types/work';
import { Prisma } from '@prisma/client';
import { buildUrl } from 'build-url-ts';

export const getWorks = async (
  props?:Prisma.WorkFindManyArgs,
): Promise<{works:WorkMosaicItem[],fetched:number,total:number}> => {
  const url = buildUrl(`${process.env.NEXT_PUBLIC_WEBAPP_URL}/api`, {
    path: 'work',
    queryParams: {
      ...props && {props:encodeURIComponent(JSON.stringify(props))}
    }
  });

  const res = await fetch(url);

  if (!res.ok) return {works:[],fetched:0,total:-1};
  const {data:works,fetched,total} = await res.json();
  return {works,fetched,total};
};

interface Options {
  staleTime?: number;
  enabled?: boolean;
}
const useWorks = (props?:Prisma.WorkFindManyArgs,options?: Options) => {
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  const key = JSON.stringify(props); 
  let ck = ['WORKS', `${key}`];

  return useQuery<{works:WorkMosaicItem[],fetched:number,total:number}>(ck, () => getWorks(props), {
    staleTime,
    enabled
  });
};

export default useWorks;
