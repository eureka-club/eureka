import { useQuery } from 'react-query';
import { NotificationSumary } from '@/types/notification';

export const getRecord = async (userId: number,take_?:number): Promise<{notifications:NotificationSumary[],total:number,news:number}> => {
  const take=take_?`&take=${take_}`:'';
  const url = `/api/notification?userId=${userId}${take}`;
  const res = await fetch(url);
  if (!res.ok) return {notifications:[],total:0,news:0};
  
  const {notifications,total,news} = await res.json();debugger;
  return {notifications,total,news};
};

interface Options {
  staleTime?: number;
  enabled?: boolean;
  take?:number;
}

const useNotifications = (id: number, options?: Options) => {
  const { staleTime, enabled, take } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  return useQuery<{notifications:NotificationSumary[],total:number,news:number}>(['USER', `${id}`, 'NOTIFICATIONS'], () => getRecord(id,take), {
    staleTime,
    enabled,
  });
};

export default useNotifications;
