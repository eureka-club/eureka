import { getCycleParticipants } from "@/src/actions/getCycleParticipants";
import { useQuery } from "react-query";
import { UserSumary } from "../types/UserSumary";

type Options={
    enabled?:boolean,
    staleTime?:number
}
export const useCycleParticipants = (id:number,opt?:Options)=>{
    const options = {
        staleTime: opt?.staleTime??1000 * 60 * 60,
        enabled:opt?.enabled??!isNaN(id),
    };
    return useQuery<UserSumary[]>(["CYCLE",id?.toString(),"PARTICIPANTS"], () => getCycleParticipants(id), options);
  }
