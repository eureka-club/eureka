import { useQuery, UseQueryResult } from 'react-query';
import { useAtom } from 'jotai';
import dayjs from 'dayjs';
import { WorkMosaicItem } from './types/work';
import { CycleMosaicItem } from './types/cycle';
import globalSearchEngineAtom from './atoms/searchEngine';

type Item = WorkMosaicItem | CycleMosaicItem;

const getRecordsWorks = async (where?: string): Promise<WorkMosaicItem[]> => {
  let url = '/api/work';
  if (where) {
    url = `/api/work${where ? `?where=${where}` : ''}`;
  }

  const res = await fetch(url);
  if (!res.ok) return [];
  const result = await res.json();

  return result.data.sort((f: WorkMosaicItem, s: WorkMosaicItem) => {
    const fCD = dayjs(f.createdAt);
    const sCD = dayjs(s.createdAt);
    if (fCD.isAfter(sCD)) return -1;
    if (fCD.isSame(sCD)) return 0;
    return 1;
  }) as WorkMosaicItem[];
};

const getRecordsCycles = async (where?: string): Promise<CycleMosaicItem[]> => {
  let url = '/api/cycle';
  if (where) {
    url = `/api/cycle${where ? `?where=${where}` : ''}`;
  }

  const res = await fetch(url);
  if (!res.ok) return [];
  const result = await res.json();

  const cycles: CycleMosaicItem[] = [];
  result.data.forEach((i: CycleMosaicItem) => {
    cycles.push({ ...i, type: 'cycle' });
  });
  return cycles.sort((f, s) => {
    const fCD = dayjs(f.createdAt);
    const sCD = dayjs(s.createdAt);
    if (fCD.isAfter(sCD)) return -1;
    if (fCD.isSame(sCD)) return 0;
    return 1;
  });
};

const getRecords = async (where?: string): Promise<Item[] | undefined> => {
  if (!where) return undefined;
  const cycles = await getRecordsCycles(where);
  const works = await getRecordsWorks(where);

  const result = [...cycles, ...works];
  return result.sort((f, s) => {
    const fCD = dayjs(f.createdAt);
    const sCD = dayjs(s.createdAt);
    if (fCD.isAfter(sCD)) return -1;
    if (fCD.isSame(sCD)) return 0;
    return 1;
  });
};

const useItems = (): UseQueryResult<Item[] | undefined, Error> => {
  const [globalSearchEngineState] = useAtom(globalSearchEngineAtom);
  const { where, q, cacheKey } = globalSearchEngineState;
  const ck = ['ITEMS', q];

  return useQuery<Item[] | undefined, Error>(cacheKey || ck, () => getRecords(where), {
    staleTime: 1000 * 60 * 60,
  });
};

export default useItems;
