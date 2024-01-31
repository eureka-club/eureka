import { backOfficeData } from '@/types/backoffice';
import { useQuery } from '@tanstack/react-query';
import { WEBAPP_URL } from './constants';

export const getbackOfficeData = async (lang:string=''): Promise<backOfficeData|null> => {
    const url = `${WEBAPP_URL||''}/api/backoffice?lang=${lang}`;
    const res = await fetch(url, {method: 'GET'});
    if (!res.ok) return null;
    const result = await res.json();
    return result.backoffice;
};


interface Options {
  staleTime?: number;
  enabled?: boolean;
}

const useBackOffice = (options?: Options,lang='') => {
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  return useQuery<backOfficeData|null>(
    {
      queryKey:['BACKOFFICE', `1`],
        queryFn:() => getbackOfficeData(lang),
    staleTime,
    enabled,
  });
};

export default useBackOffice;
