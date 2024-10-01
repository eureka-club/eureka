import { WEBAPP_URL } from "@/src/constants"
import { useQuery } from "react-query";

export const getLastNCommentsByPageId = async (page_id:number|string,count:number)=>{
    const url = `${WEBAPP_URL}/api/hyvor_talk/comments/${page_id}?limit=${count}`;
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
export const useLastNCommentsByPageId = (page_id:number|string,count:number=1,opts?:Opts)=>{
    const{enabled}=opts={enabled:true};
    return useQuery({
        queryFn:()=>getLastNCommentsByPageId(page_id,count),
        queryKey:['LAST3_COMMENTS',`${page_id}`],
        enabled
    });
}
