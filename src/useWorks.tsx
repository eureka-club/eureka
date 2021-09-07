import { useQuery } from 'react-query';
import { useAtom } from 'jotai';
import { WorkMosaicItem } from './types/work';
import globalSearchEngineAtom from './atoms/searchEngine';

export const getRecords = async (
  where?: string,
  id?: string,
): Promise<WorkMosaicItem[] | WorkMosaicItem | undefined> => {
  if (!where && !id) return undefined;
  let url = '';
  if (where) {
    url = `/api/work${where ? `?where=${where}` : ''}`;
  } else if (id) url = `/api/work/${id}`;

  const res = await fetch(url);
  if (!res.ok) return undefined;
  const result = await res.json();

  if (where) {
    // const works: WorkMosaicItem[] = [];
    // result.data.forEach((i: WorkMosaicItem) => {
    //   works.push({ ...i, type: 'work' });
    // });
    return result.data;
  }
  return { ...result.work, type: 'work' };
};

const useWorks = (id?: string) => {
  const [globalSearchEngineState] = useAtom(globalSearchEngineAtom);
  const { where, cacheKey, q } = globalSearchEngineState;
  let ck = ['WORKS', q];
  if (id) ck = ['WORKS', `${id}`];

  return useQuery<WorkMosaicItem[] | WorkMosaicItem | undefined>(cacheKey || ck, () => getRecords(where, id), {
    staleTime: 1000 * 60 * 60,
  });
};

export default useWorks;
