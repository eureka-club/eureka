import { useQuery } from 'react-query';
import { WorkMosaicItem } from './types/work';

export const getRecords = async (id: number): Promise<WorkMosaicItem | undefined> => {
  if (!id) return undefined;
  // { error: 'not work id provided' };
  const url = `/api/work/${id}`;

  const res = await fetch(url);
  if (!res.ok) return undefined;
  // { error: 'server error' };
  const { error, work } = await res.json();
  if (work) return { ...work };

  return undefined;
  // { error };
};

interface Options {
  staleTime?: number;
  enabled?: boolean;
}

const useWork = (id: number, options?: Options) => {
  const ck = ['WORK', id];
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  return useQuery<WorkMosaicItem | undefined>(ck, () => getRecords(id), {
    staleTime,
    enabled,
  });
};

export default useWork;
