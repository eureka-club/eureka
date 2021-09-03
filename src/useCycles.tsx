import { useQuery } from 'react-query';
import { useAtom } from 'jotai';
import { CycleMosaicItem } from './types/cycle';
import globalSearchEngineAtom from './atoms/searchEngine';

export const getRecords = async (
  where?: string,
  id?: number,
): Promise<CycleMosaicItem[] | CycleMosaicItem | undefined> => {
  if (!where && !id) return undefined;
  let url = '';
  if (where) {
    url = `http://localhost:3000/api/cycle${where ? `?where=${where}` : ''}`;
  } else if (id) url = `http://localhost:3000/api/cycle/${id}`;

  const res = await fetch(url);
  const result = await res.json();
  // const type = ['cycle-active', 'cycle-not-active'][0];
  // const subTypeFn = (i: ItemType) => {
  //   return 'type' in i ? `-${type}` : '';
  // };
  if (where) {
    const cycles: CycleMosaicItem[] = [];
    result.data.forEach((i: CycleMosaicItem) => {
      // result.data[k] = { ...i, TYPE: `${type}${subTypeFn(i)}` };
      cycles.push({ ...i, type: 'cycle' });
    });
    return cycles;
  }
  return { ...result.cycle, type: 'cycle' };
};

const useCycles = (id?: number) => {
  const [globalSearchEngineState] = useAtom(globalSearchEngineAtom);
  const { where } = globalSearchEngineState;
  let cacheKey = ['CYCLES', JSON.stringify({ where })];
  if (id) cacheKey = ['CYCLES', `${id}`];

  return useQuery<CycleMosaicItem[] | CycleMosaicItem | undefined>(cacheKey, () => getRecords(where, id), {
    staleTime: 1000 * 60 * 60,
  });
};

export default useCycles;
