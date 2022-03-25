import { useQuery } from 'react-query';
import { useAtom } from 'jotai';
import { CycleMosaicItem } from './types/cycle';
import globalSearchEngineAtom from './atoms/searchEngine';
import { Prisma } from '@prisma/client';

export const getCycles = async (
  where?: Prisma.CycleWhereInput,
): Promise<CycleMosaicItem[]> => {
  
  let url = '';
  const w = encodeURIComponent(JSON.stringify(where))
  url = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/api/cycle${where ? `?where=${w}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const {data} = await res.json();
  return data;
};

interface Options {
  staleTime?: number;
  enabled?: boolean;
}

const useCycles = (where?: Prisma.CycleWhereInput, options?: Options) => {
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
