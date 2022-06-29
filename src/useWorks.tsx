import { useQuery } from 'react-query';
import { WorkMosaicItem } from './types/work';
import { Prisma } from '@prisma/client';
import { buildUrl } from 'build-url-ts';

export const getWorks = async (
  q?:string,
  props?:Prisma.WorkFindManyArgs
): Promise<{works:WorkMosaicItem[],fetched:number,total:number}> => {

  const url = buildUrl(`${process.env.NEXT_PUBLIC_WEBAPP_URL}/api`, {
    path: 'work',
    queryParams: {
      q,
      props:encodeURIComponent(JSON.stringify(props||{})),
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
const useWorks = (q?:string,props?:Prisma.WorkFindManyArgs,options?: Options) => {
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  const {where,take,skip,cursor} = props || {};
  const key = `where:${JSON.stringify(where)}|take:${take}|skip:${skip}|cursor:${JSON.stringify(cursor)}`
  return useQuery<{works:WorkMosaicItem[],fetched:number,total:number}>(["WORKS",key], () => getWorks(q,props), {
    staleTime,
    enabled
  });
};

export default useWorks;
