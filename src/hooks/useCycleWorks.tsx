import GetCycleWorks from '@/src/actions/GetCycleWorks';
import { useQuery } from '@tanstack/react-query';


interface Options {
  staleTime?: number;
  enabled?: boolean;
}
export const getCycleWorks =  (id:number)=> GetCycleWorks(id)

const useCycleParticipants = (id: number, options?: Options) => {
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  return useQuery({
    queryKey:['CYCLE', `${id}`, 'PARTICIPANTS'], 
    queryFn: () => GetCycleWorks(id),
    staleTime,
    enabled,
  });
};

export default useCycleParticipants;
