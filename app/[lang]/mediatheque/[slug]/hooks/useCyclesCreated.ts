import { useQuery } from "@tanstack/react-query"
import cyclesCreated from "../actions/cyclesCreated"

export default (userId:number,lang?:string)=>{
    return useQuery({
        queryKey:['USER',userId.toString(),'CYCLES-JOINED'],
        queryFn:async ()=> await cyclesCreated(userId,lang)
    })
}