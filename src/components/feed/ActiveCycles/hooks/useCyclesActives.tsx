import { WEBAPP_URL } from "@/src/constants";
import { CycleSumary } from "@/src/types/cycle";
import { useQuery } from "react-query";

export const getCyclesActives = async ():Promise<CycleSumary[]|undefined>=>{
    const url = `${WEBAPP_URL}/api/cycle/actives`;
    const fr = await fetch(url);
    if(fr.ok){
        const {actives} = await fr.json();
        return actives;
    }
    return undefined;
}
interface Options {
    staleTime?: number;
    enabled?: boolean;
  }
export const useCyclesActives = (options?:Options)=>{
    const { staleTime, enabled } = options || {
        staleTime: 1000 * 60 * 60,
        enabled: true,
      };
      return useQuery<any[] | undefined>(['CYCLE', 'ACTIVES'], () => getCyclesActives(), {
        staleTime,
        enabled,
      });
}