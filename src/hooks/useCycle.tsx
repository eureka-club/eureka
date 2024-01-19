import { useQuery } from '@tanstack/react-query';
import { CycleDetail } from '@/src/types/cycle';
import { getCycle } from '@/src/actions/cycle/getCycle';

interface Options {
  staleTime?: number;
  enabled?: boolean;
}

const useCycle = (id: number, options?: Options) => {
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  return useQuery<CycleDetail | null>({
    queryKey:['CYCLE', `${id}`], 
    queryFn:async() => await getCycle(id),
    staleTime,
    enabled,
  });
};

export default useCycle;
