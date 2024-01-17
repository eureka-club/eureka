import { useQuery } from "@tanstack/react-query"
import { PostMosaicItem } from "../types/post"
import { WEBAPP_URL } from "../constants"

export const getFavPosts = async (id:number):Promise<PostMosaicItem[]>=>{
    const url=`${WEBAPP_URL}/api/user/${id}/favPosts`;
    const fr=await fetch(url);
    if(fr.ok){
        const {favPosts}=await fr.json();
        return (favPosts as PostMosaicItem[]).map(c=>({...c,type:'post'}))
    }
    return [];
}
export default (userId:number,lang?:string)=>{
    return useQuery({
        queryKey:['USER',userId.toString(),'FAV-POSTS'],
        queryFn:async ()=> await getFavPosts(userId)
    })
}