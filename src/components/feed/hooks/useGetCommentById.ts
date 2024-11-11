import { WEBAPP_URL } from "@/src/constants"
import { useQuery } from "react-query";

export const getCommentById = async (comment_id:number|string)=>{
    const url = `${WEBAPP_URL}/api/hyvor_talk/comment/${comment_id}`;
    const fr = await fetch(url);
    if(fr.ok){
        const {comment} = await fr.json();
        return comment
    }
    return null;
}

interface Opts{
    enabled:boolean
}
export const useGetCommentById = (comment_id:number|string,opts?:Opts)=>{
    const{enabled}=opts={enabled:true};
    return useQuery({
        queryFn:()=>getCommentById(comment_id),
        queryKey:['COMMENT',`${comment_id}`],
        enabled
    });
}
