"use client"

import { useQuery } from '@tanstack/react-query';
import { UserDetail } from '../types/user';
import { useParams } from 'next/navigation';
import { Locale } from 'i18n-config';
import { getCycleParticipants } from '@/src/actions/getCycleParticipants';

interface Options {
  staleTime?: number;
  enabled?: boolean;
}

export const useCycleParticipants = (id: number, options?: Options) => {
  const{lang}=useParams<{lang:Locale}>()!;
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  return useQuery<UserDetail[]>({
    queryKey:['CYCLE', `${id}`,'PARTICIPANTS'], 
    queryFn:async ()=> await getCycleParticipants(id),
    staleTime,
    enabled,
  });
};
