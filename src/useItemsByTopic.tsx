import { useQuery, UseQueryResult } from 'react-query';
import { GetAllByResonse, Languages } from '@/src/types';

export const getItemsByTopic = async (pageParam: number,topic:string,languages:string|undefined):Promise<GetAllByResonse> => {debugger;
  const url = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/api/getAllBy?topic=${topic}&language=${languages}&cursor=${pageParam}`;
  const q = await fetch(url);
  return q.json();
};

interface Props {
  staleTime?: number;
  enabled?: boolean;
};

const useItemsByTopic = (pageParam: number,topic:string,language:string|undefined,props?:Props): UseQueryResult<GetAllByResonse, Error> => {
  let opt: Props = props || {staleTime : 1000 * 60 * 60, enabled : true};
  const ck = ['ITEMS-BY-TOPIC',`${topic}-${pageParam}`];
  return useQuery<GetAllByResonse,Error>(ck, () => getItemsByTopic(pageParam,topic,language), opt);
};

export default useItemsByTopic;