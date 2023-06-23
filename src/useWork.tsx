import { useQuery, UseQueryResult } from 'react-query';
import { WorkMosaicItem } from './types/work';
import useTranslation from 'next-translate/useTranslation';

export const getWork = async (id: number,language:string,origin=''): Promise<WorkMosaicItem> => {
  if (!id) throw new Error('idRequired');
  const url = `${origin||''}/api/work/${id}?lang=${language}`;
  const res = await fetch(url);
  if (!res.ok) 
    throw Error('Error');

  const w =await  res.json();
  return w;
};
interface Options {
  staleTime?: number;
  enabled?: boolean;
}

const useWork = (id: number, options?: Options): UseQueryResult<WorkMosaicItem,Error> => {
  const {lang} = useTranslation();
  const ck = ['WORK', `${id}-${lang}`];
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  return useQuery<WorkMosaicItem,Error>(ck, () => getWork(id,lang!), {
    staleTime,
    enabled,
  });
};

export default useWork;
