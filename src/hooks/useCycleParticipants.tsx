"use client"
// import GetCyclePaticipants from '@/src/actions/GetCycleParticipants';
import { useQuery } from '@tanstack/react-query';
import { UserMosaicItem } from '../types/user';

interface Options {
  staleTime?: number;
  enabled?: boolean;
}
// export const getCyclePaticipants =  (id:number)=> GetCyclePaticipants(id)
export const getCyclePaticipants =  async (id:number):Promise<UserMosaicItem[]>=> {
  const url = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/api/cycle/${id}/participants`;
  const fr = await fetch(url);
  if(fr.ok){
    const {participants} = await fr.json();
    return participants;
  }
  return [];
}

const useCycleParticipants = (id: number, options?: Options) => {
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  return useQuery({
    queryKey:['CYCLE', `${id}`, 'PARTICIPANTS'], 
    queryFn: () => getCyclePaticipants(id),
    staleTime,
    enabled,
  });
};

export default useCycleParticipants;
