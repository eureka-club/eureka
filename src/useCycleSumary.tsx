import { useQuery } from 'react-query';
import { CycleSumary } from './types/cycle';
import { WEBAPP_URL } from './constants';

export const getCycleSumary = async (id: number): Promise<CycleSumary | undefined> => {
  if (!id) throw new Error('idRequired');
  const url = `${WEBAPP_URL}/api/cycle/${id}/sumary`;

  const res = await fetch(url);
  if (!res.ok) return undefined;
  const result = await res.json();

  return result.cycle ? { ...result.cycle, type: 'cycle' } : undefined;
};

interface Options {
  staleTime?: number;
  enabled?: boolean;
}

const useCycleSumary = (id: number, options?: Options) => {
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  return useQuery<CycleSumary | undefined>(['CYCLE', `${id}`,'SUMARY'], () => getCycleSumary(id), {
    staleTime,
    enabled,
  });
};

export default useCycleSumary;
