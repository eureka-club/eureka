"use client"

import { useQuery } from '@tanstack/react-query';
import { UserMosaicItem } from '../types/user';
import { useParams } from 'next/navigation';
import { Locale } from 'i18n-config';
import { getCycleParticipants } from '../actions/cycle/getParticipants';

interface Options {
  staleTime?: number;
  enabled?: boolean;
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
