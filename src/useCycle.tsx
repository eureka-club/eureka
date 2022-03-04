import { useQuery } from 'react-query';
import { CycleMosaicItem } from './types/cycle';

const getCycle = async (id: string): Promise<CycleMosaicItem | undefined> => {
  if (!id) return undefined;
  const url = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/api/cycle/${id}`;

  const res = await fetch(url);
  if (!res.ok) return undefined;
  const result = await res.json();

  return result.cycle ? { ...result.cycle, type: 'cycle' } : undefined;
};

interface Options {
  staleTime?: number;
  enabled?: boolean;
}

const useCycle = (id: string, options?: Options) => {
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  return useQuery<CycleMosaicItem | undefined>(['CYCLE', `${id}`], () => getCycle(id), {
    staleTime,
    enabled,
  });
};

export {useCycle,getCycle};
