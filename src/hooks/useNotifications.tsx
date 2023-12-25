"use client"

import { useQuery } from '@tanstack/react-query';
import { NotificationMosaicItem } from '@/src/types/notification';

export const getRecord = async (userId: number): Promise<NotificationMosaicItem[]> => {
  
  const url = `/api/notification?userId=${userId}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const result = await res.json();
  return result.notifications;
  
};


interface Options {
  staleTime?: number;
  enabled?: boolean;
}

const useNotifications = (id: number, options?: Options) => {
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  return useQuery<NotificationMosaicItem[]>({
    queryKey:['USER', `${id}`, 'NOTIFICATIONS'],
    queryFn: () => getRecord(id), 
    staleTime,
    enabled,
  });
};

export default useNotifications;
