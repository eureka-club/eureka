import { useQuery, UseQueryResult } from 'react-query';
import { WorkMosaicItem } from './types/work';

export const getWork = async (id: number): Promise<WorkMosaicItem> => {
  if (!id) throw new Error('idRequired');
  // { error: 'not work id provided' };
  const url = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/api/work/${id}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Error');
  // { error: 'server error' };
  const { work } = await res.json();
  if (work) return { ...work };

  throw new Error('notFound')
  // { error };
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
