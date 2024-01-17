import { useQuery } from "@tanstack/react-query"
import postsCreated from "../actions/favCycles"

export default (userId:number,lang?:string)=>{
    return useQuery({
        queryKey:['USER',userId.toString(),'POSTS-CREATED'],
        queryFn:async ()=> await postsCreated(userId,lang)
    })
}