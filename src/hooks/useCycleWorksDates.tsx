"use client"
// import GetCycleWorks from '@/src/actions/GetCycleWorks';
import { useQuery } from '@tanstack/react-query';
import { WorkMosaicItem } from '../types/work';
import { CycleWorksDates } from '../types/cycleWorksDates';


interface Options {
  staleTime?: number;
  enabled?: boolean;
}
// export const getCycleWorks =  (id:number)=> GetCycleWorks(id)
export const getCycleWorksDates =  async (id:number):Promise<CycleWorksDates[]>=> {
  const url = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/api/cycle/${id}/cycleWorksDates`;
  const fr = await fetch(url);
  if(fr.ok){
    const {cycleWorksDates} = await fr.json();
    return cycleWorksDates;
  };
  return [];
}

const useCycleWorksDates = (id: number, options?: Options) => {
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  return useQuery<CycleWorksDates[]>({
    queryKey:['CYCLE', `${id}`, 'WORKSDATES'], 
    queryFn: () => getCycleWorksDates(id),
    staleTime,
    enabled,
  });
};

export default useCycleWorksDates;
