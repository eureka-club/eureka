import { useQuery } from 'react-query';
import { useAtom } from 'jotai';
import dayjs from 'dayjs';
import { WorkMosaicItem } from './types/work';
import { CycleMosaicItem } from './types/cycle';
import globalSearchEngineAtom from './atoms/searchEngine';

type Item = WorkMosaicItem | CycleMosaicItem;

const getRecordsWorks = async (where?: string, q?: string): Promise<WorkMosaicItem[]> => {
  const url = `/api/work${where ? `?where=${where}` : ''}${q ? `${`${where ? '&' : '?'}q=${q}`}` : ''}`;
  // if (where) {
  //   url = `/api/work${where ? `?where=${where}` : ''}`;
  // }

  const res = await fetch(url);
  if (!res.ok) return [];
  const result = await res.json();

  return result.data as WorkMosaicItem[];
};

const getRecordsCycles = async (where?: string, q?: string): Promise<CycleMosaicItem[]> => {
  const url = `/api/cycle${where ? `?where=${where}` : ''}${q ? `${`${where ? '&' : '?'}q=${q}`}` : ''}`;
  // if (where) {
  //   url = `/api/cycle${where ? `?where=${where}` : ''}`;
  // }

  const res = await fetch(url);
  if (!res.ok) return [];
  const result = await res.json();

  const cycles: CycleMosaicItem[] = [];
  result.data.forEach((i: CycleMosaicItem) => {
    cycles.push({ ...i, type: 'cycle' });
  });
  return cycles;
};

const getRecords = async (where?: string, q?: string): Promise<Item[] | undefined> => {
  if (!where) return undefined;
  let cycles = await getRecordsCycles(where);
  cycles = cycles.sort((f, s) => {
    const fCD = dayjs(f.createdAt);
    const sCD = dayjs(s.createdAt);
    if (fCD.isAfter(sCD)) return -1;
    if (fCD.isSame(sCD)) return 0;
    return 1;
  });
  let works = await getRecordsWorks(where);
  works = works.sort((f, s) => {
    const fCD = dayjs(f.createdAt);
    const sCD = dayjs(s.createdAt);
    if (fCD.isAfter(sCD)) return -1;
    if (fCD.isSame(sCD)) return 0;
    return 1;
  });

  const result = [...cycles, ...works];
  return result;
};

const useItems = () => {
  const [globalSearchEngineState] = useAtom(globalSearchEngineAtom);
  const { where, q, cacheKey } = globalSearchEngineState;
  const ck = ['ITEMS', q];

  return useQuery<Item[] | undefined>(cacheKey || ck, () => getRecords(where, q), {
    staleTime: 1000 * 60 * 60,
  });
};

export default useItems;
