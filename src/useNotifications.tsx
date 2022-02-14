import { useQuery } from 'react-query';
import { NotificationMosaicItem } from '@/types/notification';

export const getRecord = async (userId: string): Promise<NotificationMosaicItem[]> => {
  
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

const useNotifications = (id: string, options?: Options) => {
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  return useQuery<NotificationMosaicItem[]>(['USER', `${id}`, 'NOTIFICATIONS'], () => getRecord(id), {
    staleTime,
    enabled,
  });
};

export default useNotifications;
