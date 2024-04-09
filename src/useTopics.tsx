import { useQuery } from 'react-query';
// import { useAtom } from 'jotai';
// import globalSearchEngineAtom from './atoms/searchEngine';

export interface TopicItem{ code: string; label: string, emoji?:string }
const getRecords = async () => {
  const res = await fetch(`/api/taxonomy/topics`);
  const { result } = await res.json();
  return result.map((i: TopicItem) => ({ code: i.code, label: i.label, emoji: i.emoji }));
};

const useTopics = () => {
  return useQuery<TopicItem[]>('TOPICS', getRecords, {
    staleTime: 1000 * 60 * 60,
  });
};

export default useTopics;
