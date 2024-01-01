import { PostMosaicItem } from "@/src/types/post";
import { useQuery } from "@tanstack/react-query"
// import postsCreated from "../actions/postsCreated"

export const getPostsCreated = async (userId:number):Promise<PostMosaicItem[]>=>{
    const url = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/api/user/${userId}/posts`;
    const fr = await fetch(url);
    if(fr.ok){
        const {posts} = await fr.json();
        return posts;
    }
    return [];
}
export default (userId:number)=>{
    
    return useQuery({
        queryKey:['USER',userId.toString(),'POSTS-CREATED'],
        queryFn:async ()=> await getPostsCreated(userId)
    })
}