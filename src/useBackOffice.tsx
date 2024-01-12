import { backOfficeData } from '@/types/backoffice';
import { useQuery } from '@tanstack/react-query';

export const getbackOfficeData = async (origin?:string): Promise<backOfficeData|null> => {
    const url = `${origin||''}/api/backoffice`;
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
  return useQuery<backOfficeData|null>(
    {
      queryKey:['BACKOFFICE', `1`],
        queryFn:() => getbackOfficeData(),
    staleTime,
    enabled,
  });
};

export default useBackOffice;
