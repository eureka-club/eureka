import { useQuery } from 'react-query';
import { CycleDetail } from './types/cycle';
import { WEBAPP_URL } from './constants';

export const getCycle = async (id: Number): Promise<CycleDetail | undefined> => {
  if (!id) return undefined;
  const url = `${WEBAPP_URL}/api/cycle/${id}`;

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
  return useQuery<CycleDetail | undefined>(['CYCLE', `${id}`], () => getCycle(id), {
    staleTime,
    enabled,
  });
};

export default useCycle;
