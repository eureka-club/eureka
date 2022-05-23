import { useQuery } from 'react-query';
import { useAtom } from 'jotai';
import { CycleMosaicItem } from './types/cycle';
import globalSearchEngineAtom from './atoms/searchEngine';
import { Prisma } from '@prisma/client';
import { buildUrl } from 'build-url-ts';


export const getCycles = async (
  props?: Prisma.CycleFindManyArgs,
): Promise<CycleMosaicItem[]> => {

  const {where:w, take:t, skip:s, cursor:c} = props||{};
  
  const where = w ? encodeURIComponent(JSON.stringify(w)) : '';
  const cursor = c ? encodeURIComponent(JSON.stringify(c)) : '';
  const take = t ? t : ''
  const skip = s ? s : ''

  const url = buildUrl(`${process.env.NEXT_PUBLIC_API_URL}/api`, {
    path: 'wocyclerk',
    queryParams: {
      where,
      take,
      skip,
      cursor,
    }
  });

  const res = await fetch(url);
  if (!res.ok) return [];
  const {data} = await res.json();
  return data;
};

interface Options {
  staleTime?: number;
  enabled?: boolean;
}

const useCycles = (where?: Prisma.CycleFindManyArgs, options?: Options) => {
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  // const [globalSearchEngineState] = useAtom(globalSearchEngineAtom);
  // const { where, cacheKey, q } = globalSearchEngineState;
  let ck = ['CYCLES', `${JSON.stringify(where)}`];
  // if (id) ck = ['CYCLES', `${id}`];

  return useQuery<CycleMosaicItem[]>(ck, () => getCycles(where), {
    staleTime,
    enabled,
    retry:3
  });
};

export default useCycles;
