import { WEBAPP_URL } from "@/src/constants"
import { useQuery } from "react-query";

export const getLast3CommentsByPageId = async (page_id:number|string)=>{
    const url = `${WEBAPP_URL}/api/hyvor_talk/comments/${page_id}?limit=3`;
    const fr = await fetch(url);
    if(fr.ok){
        const {data} = await fr.json();
        return data
    }
    return null;
}

interface Opts{
    enabled:boolean
}
export const useLast3CommentsByPageId = (page_id:number|string,opts?:Opts)=>{
    const{enabled}=opts={enabled:true};
    return useQuery({
        queryFn:()=>getLast3CommentsByPageId(page_id),
        queryKey:['LAST3_COMMENTS',`${page_id}`],
        enabled
    });
}
