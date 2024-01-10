import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { GetAllByResonse } from '@/src/types';

export const getItemsByTopic = async (pageParam: number,topic:string,language:string|undefined):Promise<GetAllByResonse> => {
  const url = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/api/getAllBy?topic=${topic}&language=${language}&cursor=${pageParam}`;
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
  return useQuery<GetAllByResonse,Error>({
    queryKey:ck,
    queryFn: () => getItemsByTopic(pageParam,topic,language),
    ...opt
  })
};

export default useItemsByTopic;