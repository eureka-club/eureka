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
  return { ...result.cycle, type: 'cycle' };
};

const useCycles = (id?: string) => {
  const [globalSearchEngineState] = useAtom(globalSearchEngineAtom);
  const { where, cacheKey, q } = globalSearchEngineState;
  let ck = ['CYCLES', q];
  if (id) ck = ['CYCLES', `${id}`];

  return useQuery<CycleMosaicItem[] | CycleMosaicItem | undefined>(cacheKey || ck, () => getRecords(where, id), {
    staleTime: 1000 * 60 * 60,
  });
};

export default useCycles;
