import { WorkMosaicItem } from '@/src/types/work';
import { useDictContext } from './useDictContext';
import { UseQueryResult, useQuery } from '@tanstack/react-query';

export const getWork = async (id: number,language:string | undefined,origin=''): Promise<WorkMosaicItem> => {
  if (!id) throw new Error('idRequired');
  let url = `${origin || ''}/api/work/${id}`; // ?lang=${language}
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

const useWork = (id: number, options?: Options): UseQueryResult<WorkMosaicItem,Error> => {
  const{langs}=useDictContext()
  const { staleTime, enabled, notLangRestrict } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  const ck = notLangRestrict ? ['WORK', `${id}`] : ['WORK', `${id}-${langs}`];
  return useQuery<WorkMosaicItem, Error>({
    queryKey:ck, 
    queryFn:() => getWork(id, !notLangRestrict ? langs!:undefined),
    staleTime,
    enabled,
  });
};

export default useWork;
