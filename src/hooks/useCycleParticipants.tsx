"use client"

import { useQuery } from '@tanstack/react-query';
import { UserMosaicItem } from '../types/user';
import { WEBAPP_URL } from '../constants';
import { useParams } from 'next/navigation';
import { Locale } from 'i18n-config';

interface Options {
  staleTime?: number;
  enabled?: boolean;
}
export const getCycleParticipants = async (id:number)=>{
  const url = `${WEBAPP_URL}/api/cycle/${id}/participants`;
  const fr = await fetch(url);
  const posts = fr.ok? await fr.json() as UserMosaicItem[] : [];
  return posts;
}
const useCycleParticipants = (id: number, options?: Options) => {
  const{lang}=useParams<{lang:Locale}>()!;
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  return useQuery<UserMosaicItem[]>({
    queryKey:['CYCLE', `${id}`,'PARTICIPANTS'], 
    queryFn:async ()=> await getCycleParticipants(id),
    staleTime,
    enabled,
  });
};

export default useCycleParticipants;
