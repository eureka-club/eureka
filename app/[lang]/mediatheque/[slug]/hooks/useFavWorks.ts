import { useQuery } from "@tanstack/react-query"
import favWorks from "../actions/favWorks"

export default (userId:number,lang?:string)=>{
    return useQuery({
        queryKey:['USER',userId.toString(),'FAV-WORKS'],
        queryFn:async ()=> await favWorks(userId,lang)
    })
}