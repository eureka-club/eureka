import { useQuery, UseQueryResult } from 'react-query';
import { WorkMosaicItem } from './types/work';

export const getWork = async (id: number,origin=''): Promise<WorkMosaicItem> => {
  if (!id) throw new Error('idRequired');
  const url = `${origin||''}/api/work/${id}`;
  const res = await fetch(url);
  if (!res.ok) 
    throw Error('Error');

  return res.json();
};
interface Options {
  staleTime?: number;
  enabled?: boolean;
}

const useWork = (id: number, options?: Options): UseQueryResult<WorkMosaicItem,Error> => {
  const ck = ['WORK', `${id}`];
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  return useQuery<WorkMosaicItem,Error>(ck, () => getWork(id), {
    staleTime,
    enabled,
  });
};

export default useWork;
