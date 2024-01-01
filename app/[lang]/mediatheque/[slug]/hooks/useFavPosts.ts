import { PostMosaicItem } from "@/src/types/post";
import { useQuery } from "@tanstack/react-query"
// import favPosts from "../actions/favPosts"

export const getFavPosts = async (userId:number):Promise<PostMosaicItem[]>=>{
    const url = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/api/user/${userId}/favPosts`;
    const fr = await fetch(url);
    if(fr.ok){
        const {favPosts}=await fr.json();
        return favPosts;
    }
    return [];
}
export default (userId:number)=>{
    return useQuery({
        queryKey:['USER',userId.toString(),'FAV-POSTS'],
        queryFn:async ()=> await getFavPosts(userId)
    })
}