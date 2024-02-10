import { useQuery, UseQueryResult } from 'react-query';
import { WorkSumary } from './types/work';
import useTranslation from 'next-translate/useTranslation';
import { WEBAPP_URL } from './constants';

export const getWorkSumary = async (id: number,language:string | undefined): Promise<WorkSumary> => {
  if (!id) throw new Error('idRequired');
  let url = `${WEBAPP_URL}/api/work/${id}/sumary`; // ?lang=${language}
  if(language)
    url += `?lang=${language}`;

  const res = await fetch(url);
  if (!res.ok) 
    throw Error('Error');

  const w =await  res.json();
  return w;
};
interface Options {
  staleTime?: number;
  enabled?: boolean;
  notLangRestrict?:boolean
}

const useWorkSumary = (id: number, options?: Options): UseQueryResult<WorkSumary,Error> => {
  const {lang} = useTranslation();
  const { staleTime, enabled, notLangRestrict } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  const ck =  ['WORK', `${id}`, 'SUMARY'];
  return useQuery<WorkSumary, Error>(ck, () => getWorkSumary(id, !notLangRestrict ? lang!:undefined), {
    staleTime,
    enabled,
  });
};

export default useWorkSumary;
