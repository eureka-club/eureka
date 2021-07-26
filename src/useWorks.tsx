import { useQuery } from 'react-query';
import { useAtom } from 'jotai';
// import { WorkMosaicItem } from './types/work';
import globalSearchEngineAtom from './atoms/searchEngine';

const getRecords = async (where = '', id = '') => {
  if (!where) return { data: [] };
  let url = '/api/work';
  if (!where && !id) return null;
  if (where) url = `${url}?where=${where}`;
  else if (id) url = `/api/work?id=${id}`;
  const res = await fetch(url);
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

const useWorks = (id?: string) => {
  const [globalSearchEngineState] = useAtom(globalSearchEngineAtom);
  const { where } = globalSearchEngineState;
  let key = encodeURIComponent(JSON.stringify({ where }));
  if (id) key = id;
  return useQuery(['WORKS', key], () => getRecords(where, id), {
    staleTime: 1000 * 60 * 60,
  });
};

export default useWorks;
