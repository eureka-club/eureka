import { useQuery } from "@tanstack/react-query"
import cyclesJoined from "../actions/joinedCycles"

export default (userId:number,lang?:string)=>{
    return useQuery({
        queryKey:['USER',userId.toString(),'CYCLES-JOINED'],
        queryFn:async ()=> await cyclesJoined(userId,lang)
    })
}