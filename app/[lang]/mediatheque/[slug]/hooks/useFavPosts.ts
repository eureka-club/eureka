import { useQuery } from "@tanstack/react-query"
import favPosts from "../actions/favPosts"

export default (userId:number,lang?:string)=>{
    return useQuery({
        queryKey:['USER',userId.toString(),'FAV-POSTS'],
        queryFn:async ()=> await favPosts(userId,lang)
    })
}