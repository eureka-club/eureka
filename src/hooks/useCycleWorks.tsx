"use client"
// import GetCycleWorks from '@/src/actions/GetCycleWorks';
import { useQuery } from '@tanstack/react-query';
import { WorkMosaicItem } from '../types/work';


interface Options {
  staleTime?: number;
  enabled?: boolean;
}
// export const getCycleWorks =  (id:number)=> GetCycleWorks(id)
export const getCycleWorks =  async (id:number):Promise<WorkMosaicItem[]>=> {
  const url = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/cycle/${id}/works`;
  const fr = await fetch(url);
  if(fr.ok){
    const {works} = await fr.json();
    return works;
  };
  return [];
}

const useCycleWorks = (id: number, options?: Options) => {
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  return useQuery({
    queryKey:['CYCLE', `${id}`, 'WORKS'], 
    queryFn: () => getCycleWorks(id),
    staleTime,
    enabled,
  });
};

export default useCycleWorks;
