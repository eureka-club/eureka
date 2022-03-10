import { useQuery, UseQueryResult } from 'react-query';
import { WorkDetail } from './types/work';

export const getRecord = async (id: number): Promise<WorkDetail> => {
  if (!id) throw new Error('idRequired');
  // { error: 'not work id provided' };
  const url = `/api/work/${id}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Error');
  // { error: 'server error' };
  const result = await res.json();
  return result.work;
  // { error };
};

interface Options {
  staleTime?: number;
  enabled?: boolean;
}

const useWork = (id: number, options?: Options): UseQueryResult<WorkDetail,Error> => {
  const ck = ['WORK', `${id}`];
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  return useQuery<WorkDetail,Error>(ck, () => getRecord(id), {
    // staleTime,
    enabled,
  });
};

export default useWork;
