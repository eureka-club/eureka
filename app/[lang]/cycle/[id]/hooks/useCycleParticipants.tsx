import GetCyclePaticipants from '@/src/actions/GetCycleParticipants';
import { useQuery } from '@tanstack/react-query';


interface Options {
  staleTime?: number;
  enabled?: boolean;
}
export const getCyclePaticipants =  (id:number)=> GetCyclePaticipants(id)
const useCycleParticipants = (id: number, options?: Options) => {
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  return useQuery({
    queryKey:['CYCLE', `${id}`, 'PARTICIPANTS'], 
    queryFn: () => GetCyclePaticipants(id),
    staleTime,
    enabled,
  });
};

export default useCycleParticipants;
