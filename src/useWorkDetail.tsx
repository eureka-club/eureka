import { useQuery, UseQueryResult } from 'react-query';
import { WorkDetail } from './types/work';
import useTranslation from 'next-translate/useTranslation';
import { WEBAPP_URL } from './constants';

export const getWork = async (id: number,language:string | undefined): Promise<WorkDetail|undefined> => {
  if (!id) return undefined;
  let url = `${WEBAPP_URL}/api/work/${id}`; // ?lang=${language}
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

const useWorkDetail = (id: number, options?: Options): UseQueryResult<WorkDetail|undefined> => {
  const {lang} = useTranslation();
  const { staleTime, enabled, notLangRestrict } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  const ck =  ['WORK', `${id}`];
  return useQuery<WorkDetail|undefined>(ck, () => getWork(id, !notLangRestrict ? lang!:undefined),
   {
    staleTime,
    enabled,
  }
);
};

export default useWorkDetail;
