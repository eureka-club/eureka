import { WEBAPP_URL } from "@/src/constants";
import { Action } from "@prisma/client";
import { useQuery } from "react-query";

interface Props{
  skip?:number;
  take?:number
}
export const getActions = async (props?:Props):Promise<{actions:Action[],total:number}|undefined>=>{
    const{skip,take}=props??{skip:'',take:''};
    const url = `${WEBAPP_URL}/api/action?${skip?`skip=${skip}&`:''}${take?`take=${take}`:''}`;
    const fr = await fetch(url);
    if(fr.ok){
        const {actions,total} = await fr.json();
        return {actions,total};
    }
    return undefined;
}
interface Options {
    staleTime?: number;
    enabled?: boolean;
    skip?:number;
    take?:number;
  }
export const useActions = (options?:Options)=>{
    const { staleTime, enabled,skip,take } = options || {
        staleTime: 1000 * 60 * 60,
        enabled: true,
      };
      return useQuery<{actions:Action[],total:number} | undefined>(['FEED','ACTIONS',skip,take], () => getActions({skip,take}), {
        staleTime,
        enabled,
      });
}