import { useQuery } from 'react-query';
// import { useAtom } from 'jotai';
// import globalSearchEngineAtom from './atoms/searchEngine';

const getRecords = async () => {
  const res = await fetch(`/api/taxonomy/topics`);
  const { result } = await res.json();
  return result.map((i: { code: string; label: string }) => ({ code: i.code, label: i.label }));
};

const useTopis = () => {
  return useQuery('TOPICS', getRecords, {
    staleTime: 1000 * 60 * 60,
  });
};

export default useTopis;
