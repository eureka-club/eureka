import { useQuery, UseQueryResult } from 'react-query';
import { useAtom } from 'jotai';
import dayjs from 'dayjs';
import { WorkMosaicItem } from './types/work';
import { CycleMosaicItem } from './types/cycle';
import { PostMosaicItem } from './types/post';
import globalSearchEngineAtom from './atoms/searchEngine';
import {SearchResult} from "@/src/types"

// type Item = WorkMosaicItem | CycleMosaicItem

const getRecordsWorks = async (q?: string): Promise<WorkMosaicItem[]> => {
  let url = '/api/work';
  if(q){
    url = `/api/work${q ? `?q=${q}` : ''}`;
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

const getRecordsCycles = async (q?: string): Promise<CycleMosaicItem[]> => {
  let url = '/api/cycle';
  if (q) {
    url = `/api/cycle${q ? `?q=${q}` : ''}`;
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

const getRecordsPosts = async (q?: string): Promise<PostMosaicItem[]> => {
  let url = '/api/post';
  if (q) {
    url = `/api/post${q ? `?q=${q}` : ''}`;
  }

  const res = await fetch(url);
  if (!res.ok) return [];
  const result = await res.json();
  debugger;
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

export const getRecords = async (q?: string): Promise<SearchResult[]> => {
  const cycles = await getRecordsCycles(q);
  const works = await getRecordsWorks(q);
  const posts = await getRecordsPosts(q);

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

const useItems = (q?:string, cacheKey?: string | string [], props?: Props): UseQueryResult<SearchResult[], Error> => {
  let opt: Props = {staleTime : 1000 * 60 * 60, enabled : true};
  if(props)
    opt = {...opt, ...props};
  // const [globalSearchEngineState] = useAtom(globalSearchEngineAtom);
  // const { q, cacheKey } = globalSearchEngineState;
  const ck = ['ITEMS', q];

  return useQuery<SearchResult[], Error>(cacheKey || ck, () => getRecords(q), opt);
};

export default useItems;
