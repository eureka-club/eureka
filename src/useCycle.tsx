import { useQuery } from '@tanstack/react-query';;
import { CycleDetail } from './types/cycle';

export const getCycle = async (id: number,origin=''): Promise<CycleDetail | undefined> => {
  if (!id) throw new Error('idRequired');
  const url = `${origin||''}/api/cycle/${id}/detail`;

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
  return useQuery<CycleDetail | undefined>(
    {
       queryKey:['CYCLE', `${id}`],
        queryFn:() => getCycle(id), 
    staleTime,
    enabled,
  });
};

export default useCycle;
