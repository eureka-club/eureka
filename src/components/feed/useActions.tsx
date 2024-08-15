import { WEBAPP_URL } from "@/src/constants";
import { Action } from "@prisma/client";
import { useQuery } from "react-query";

export const getActions = async ():Promise<Action[]|undefined>=>{
    const url = `${WEBAPP_URL}/api/action`;
    const fr = await fetch(url);
    if(fr.ok){
        const {actions} = await fr.json();
        return actions;
    }
    return undefined;
}
interface Options {
    staleTime?: number;
    enabled?: boolean;
  }
export const useActions = (options?:Options)=>{
    const { staleTime, enabled } = options || {
        staleTime: 1000 * 60 * 60,
        enabled: true,
      };
      return useQuery<Action[] | undefined>(['FEED','ACTIONS'], () => getActions(), {
        staleTime,
        enabled,
      });
}