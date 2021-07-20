import { useQuery } from 'react-query';
import { useAtom } from 'jotai';
import { CycleMosaicItem } from './types/cycle';
import globalSearchEngineAtom from './atoms/searchEngine';

const getRecords = async (where = '') => {
  // if (!where) return { data: [] };
  const res = await fetch(`/api/cycle${where ? `?where=${where}` : ''}`);
  const result = await res.json();

  type ItemType = CycleMosaicItem & { type: string };
  // const type = ['cycle-active', 'cycle-not-active'][0];
  const type = ['cycle', 'cycle'][0];
  // const subTypeFn = (i: ItemType) => {
  //   return 'type' in i ? `-${type}` : '';
  // };
  result.data.forEach((i: ItemType, k: string) => {
    // result.data[k] = { ...i, TYPE: `${type}${subTypeFn(i)}` };
    result.data[k] = { ...i, type: `${type}` };
  });
  return result;
};

const useCycles = () => {
  const [globalSearchEngineState] = useAtom(globalSearchEngineAtom);
  const { where } = globalSearchEngineState;

  return useQuery(['CYCLES', JSON.stringify({ where })], () => getRecords(where), {
    staleTime: 1000 * 60 * 60,
  });
};

export default useCycles;
