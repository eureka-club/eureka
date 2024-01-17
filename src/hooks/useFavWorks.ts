import { useQuery } from "@tanstack/react-query"
import { WorkMosaicItem } from "../types/work"
import { WEBAPP_URL } from "../constants"

export const getFavWorks = async (id:number):Promise<WorkMosaicItem[]>=>{
    const url=`${WEBAPP_URL}/api/user/${id}/favWorks`;
    const fr=await fetch(url);
    if(fr.ok){
        const {favWorks}=await fr.json();
        return (favWorks as WorkMosaicItem[]).map(c=>({...c,type:'post'}))
    }
    return [];
}
export default (userId:number,lang?:string)=>{
    return useQuery({
        queryKey:['USER',userId.toString(),'FAV-WORKS'],
        queryFn:async ()=> await getFavWorks(userId)
    })
}