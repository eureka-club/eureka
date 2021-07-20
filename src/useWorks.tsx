import { useQuery } from 'react-query';
import { useAtom } from 'jotai';
// import { WorkMosaicItem } from './types/work';
import globalSearchEngineAtom from './atoms/searchEngine';

const getRecords = async (where = '') => {
  if (!where) return { data: [] };
  const res = await fetch(`/api/work${where ? `?where=${where}` : ''}`);
  const result = await res.json();

  // type ItemType =
  //   // | (CycleMosaicItem & { TYPE: string })
  //   WorkMosaicItem //& { TYPE: string };
  // | (PostMosaicItem & { TYPE: string });
  // const subTypeFn = (i: ItemType) => {
  //   return 'type' in i ? `-${i.type}` : '';
  // };
  // result.data.forEach((i: ItemType, k: string) => {
  //   result.data[k] = { ...i, TYPE: `work${subTypeFn(i)}` };
  // });
  return result;
};

const useWorks = () => {
  const [globalSearchEngineState] = useAtom(globalSearchEngineAtom);
  const { where } = globalSearchEngineState;

  return useQuery(['WORKS', JSON.stringify({ where })], () => getRecords(where), {
    staleTime: 1000 * 60 * 60,
  });
};

export default useWorks;
