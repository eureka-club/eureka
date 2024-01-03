"use client"
import { useQuery } from '@tanstack/react-query';
import { CycleMosaicItem } from '../types/cycle';
import { BAD_REQUEST } from '../api_codes';
// import GetCycle from '../actions/GetCycle';

export const getCycle = async (id: number): Promise<CycleMosaicItem|null> => {
  if (!id) throw new Error(BAD_REQUEST);
  const url = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/api/cycle/${id}`;

  const res = await fetch(url);
  if (res.ok) {
    const {cycle} = await res.json();
    return {...cycle,type:'cycle'};
  }
  return null;
};
// export const getCycle = (id:number) => GetCycle(id);

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
