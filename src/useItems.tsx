import { useQuery, UseQueryResult } from 'react-query';
import { useAtom } from 'jotai';
import dayjs from 'dayjs';
import { WorkMosaicItem } from './types/work';
import { CycleMosaicItem } from './types/cycle';
import { PostMosaicItem } from './types/post';
import globalSearchEngineAtom from './atoms/searchEngine';
import {SearchResult} from "@/src/types"

// type Item = WorkMosaicItem | CycleMosaicItem

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

const getRecordsPosts = async (where?: string): Promise<PostMosaicItem[]> => {
  let url = '/api/post';
  if (where) {
    url = `/api/post${where ? `?where=${where}` : ''}`;
  }

  const res = await fetch(url);
  if (!res.ok) return [];
  const result = await res.json();

  const posts: PostMosaicItem[] = [];
  result.data.forEach((i: PostMosaicItem) => {
    posts.push({ ...i, type: 'post' });
  });
  return posts.sort((f, s) => {
    const fCD = dayjs(f.createdAt);
    const sCD = dayjs(s.createdAt);
    if (fCD.isAfter(sCD)) return -1;
    if (fCD.isSame(sCD)) return 0;
    return 1;
  });
};

export const getRecords = async (where?: string): Promise<SearchResult[]> => {
  if (!where) throw new Error('notFound');
  const cycles = await getRecordsCycles(where);
  const works = await getRecordsWorks(where);
  const posts = await getRecordsPosts(where);

  const result = [...cycles, ...works, ...posts];
  return result.sort((f, s) => {
    const fCD = dayjs(f.createdAt);
    const sCD = dayjs(s.createdAt);
    if (fCD.isAfter(sCD)) return -1;
    if (fCD.isSame(sCD)) return 0;
    return 1;
  });
};
interface Props {
  staleTime?: number;
  enabled?: boolean;
};

const useItems = (where?: string, cacheKey?: string | string [], props?: Props): UseQueryResult<SearchResult[], Error> => {
  let opt: Props = {staleTime : 1000 * 60 * 60, enabled : true};
  if(props)
    opt = {...opt, ...props};
  // const [globalSearchEngineState] = useAtom(globalSearchEngineAtom);
  // const { q, cacheKey } = globalSearchEngineState;
  const ck = ['ITEMS', ''];

  return useQuery<SearchResult[], Error>(cacheKey || ck, () => getRecords(where), opt);
};

export default useItems;
