import { useQuery } from 'react-query';
import { WorkMosaicItem } from './types/work';

export const getRecords = async (id: number): Promise<WorkMosaicItem | undefined> => {
  if (!id) return undefined;
  const url = `/api/work/${id}`;

  const res = await fetch(url);
  if (!res.ok) return undefined;
  const result = await res.json();

  return { ...result.work };
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
