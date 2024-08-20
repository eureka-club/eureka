import { WEBAPP_URL } from "@/src/constants";
import { Action } from "@prisma/client";
import { useQuery } from "react-query";

interface Props{
  skip?:number;
  total?:number
}
export const getActions = async (props?:Props):Promise<{actions:Action[],total:number,nextSkip:number}|undefined>=>{
    const{skip,total}=props??{skip:'',total:''};
    const url = `${WEBAPP_URL}/api/action?${skip?`skip=${skip}&`:''}${total?`total=${total}&`:''}`;
    const fr = await fetch(url);
    if(fr.ok){
        const {actions,total,nextSkip} = await fr.json();
        return {actions,total,nextSkip};
    }
    return undefined;
}
interface Options {
    staleTime?: number;
    enabled?: boolean;
    skip?:number;
  }
export const useActions = (options?:Options)=>{
    const { staleTime, enabled,skip, } = options || {
        staleTime: 1000 * 60 * 60,
        enabled: true,
      };
      return useQuery<{actions:Action[],total:number} | undefined>(['FEED','ACTIONS',skip], () => getActions({skip,}), {
        staleTime,
        enabled,
      });
}