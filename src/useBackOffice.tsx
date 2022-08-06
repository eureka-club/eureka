import { useQuery } from 'react-query';
import { backOfficeData } from '@/types/backoffice';

export const getbackOfficeData = async (): Promise<backOfficeData|null> => {
    const url = `/api/backoffice`;
    const res = await fetch(url, {method: 'GET'});
    if (!res.ok) return null;
    const result = await res.json();
    return result.backoffice;
};


interface Options {
  staleTime?: number;
  enabled?: boolean;
}

const useBackOffice = (options?: Options) => {
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  return useQuery<backOfficeData|null>(['BACKOFFICE', `1`], () => getbackOfficeData(), {
    staleTime,
    enabled,
  });
};

export default useBackOffice;
