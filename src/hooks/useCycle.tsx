import { useQuery } from '@tanstack/react-query';
import GetCycle from '../actions/GetCycle';

// export const getCycle = async (id: number,origin=''): Promise<CycleMosaicItem | undefined> => {
//   if (!id) throw new Error('idRequired');
//   const url = `${origin||''}/api/cycle/${id}`;

//   const res = await fetch(url);
//   if (!res.ok) return undefined;
//   const result = await res.json();

//   return result.cycle ? { ...result.cycle, type: 'cycle' } : undefined;
// };
export const getCycle = (id:number) => GetCycle(id);

interface Options {
  staleTime?: number;
  enabled?: boolean;
}

const useCycle = (id: number, options?: Options) => {
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  return useQuery({
    queryKey:['CYCLE', `${id}`], 
    queryFn:  () =>  getCycle(id),
    staleTime,
    enabled,
  });
};

export default useCycle;
