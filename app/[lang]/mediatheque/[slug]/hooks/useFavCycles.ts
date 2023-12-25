import { useQuery } from "@tanstack/react-query"
import favCycles from "../actions/favCycles"

export default (userId:number,lang?:string)=>{
    return useQuery({
        queryKey:['USER',userId.toString(),'FAV-CYCLES'],
        queryFn:async ()=> await favCycles(userId,lang)
    })
}