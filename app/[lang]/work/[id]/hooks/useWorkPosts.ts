import { PostMosaicItem } from "@/src/types/post"
import { useQuery } from "@tanstack/react-query"

export const getWorkPosts = async (workId:number):Promise<PostMosaicItem[]>=>{
    const url = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/api/work/${workId}/posts`;
    const fr = await fetch(url);
    if(fr.ok){
        const {posts}=await fr.json();debugger;
        return posts;
    }
    return [];
}
export default (workId:number)=>{
    return useQuery({
        queryKey:['WORK',workId.toString(),'POSTS'],
        queryFn:()=>getWorkPosts(workId),
    })
}