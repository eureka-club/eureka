import { useQuery } from "@tanstack/react-query"
import { PostDetail } from "../types/post"
import { WEBAPP_URL } from "../constants"

export const getFavPosts = async (id:number):Promise<PostDetail[]>=>{
    const url=`${WEBAPP_URL}/api/user/${id}/favPosts`;
    const fr=await fetch(url);
    if(fr.ok){
        const {favPosts}=await fr.json();
        return (favPosts as PostDetail[]).map(c=>({...c,type:'post'}))
    }
    return [];
}
export default (userId:number,lang?:string)=>{
    return useQuery({
        queryKey:['USER',userId.toString(),'FAV-POSTS'],
        queryFn:async ()=> await getFavPosts(userId)
    })
}