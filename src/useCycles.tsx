import { useQuery } from 'react-query';
import { useAtom } from 'jotai';
import { CycleMosaicItem } from './types/cycle';
import globalSearchEngineAtom from './atoms/searchEngine';

export const getRecords = async (
  where?: string,
  id?: string,
): Promise<CycleMosaicItem[] | CycleMosaicItem | undefined> => {
  if (!where && !id) return undefined;
  let url = '';
  if (where) {
    url = `/api/cycle${where ? `?where=${where}` : ''}`;
  } else if (id) url = `/api/cycle/${id}`;

  const res = await fetch(url);
  if (!res.ok) return undefined;
  const result = await res.json();
  if (where) {
    const cycles: CycleMosaicItem[] = [];
    result.data.forEach((i: CycleMosaicItem) => {
      cycles.push({ ...i, type: 'cycle' });
    });
    return cycles;
  }
  return result.cycle ? { ...result.cycle, type: 'cycle' } : undefined;
};

interface Options {
  staleTime?: number;
  enabled?: boolean;
}

const useCycles = (id?: string, options?: Options) => {
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  const [globalSearchEngineState] = useAtom(globalSearchEngineAtom);
  const { where, cacheKey, q } = globalSearchEngineState;
  let ck = ['CYCLES', q];
  if (id) ck = ['CYCLES', `${id}`];

  return useQuery<CycleMosaicItem[] | CycleMosaicItem | undefined>(cacheKey || ck, () => getRecords(where, id), {
    staleTime,
    enabled,
  });
};

export default useCycles;
