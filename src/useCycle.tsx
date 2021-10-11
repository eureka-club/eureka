import { useQuery } from 'react-query';
import { CycleMosaicItem } from './types/cycle';

export const getRecord = async (id: number): Promise<CycleMosaicItem | undefined> => {
  if (!id) return undefined;
  const url = `/api/cycle/${id}`;

  const res = await fetch(url);
  if (!res.ok) return undefined;
  const result = await res.json();

  return result.cycle ? { ...result.cycle, type: 'cycle' } : undefined;
};

interface Options {
  staleTime?: number;
  enabled?: boolean;
}

const useCycle = (id: number, options?: Options) => {
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  return useQuery<CycleMosaicItem | undefined>(['CYCLE', `${id}`], () => getRecord(id), {
    staleTime,
    enabled,
  });
};

export default useCycle;
