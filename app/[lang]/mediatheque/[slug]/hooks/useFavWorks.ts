import { WorkMosaicItem } from "@/src/types/work"
import { useQuery } from "@tanstack/react-query"
// import favWorks from "../actions/favWorks"

export const getFavWorks = async (userId:number):Promise<WorkMosaicItem[]>=>{
    const url = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/user/${userId}/favWorks`;
    const fr = await fetch(url);
    if(fr.ok){
        const{favWorks}=await fr.json();
        return favWorks;
    }
    return [];
}
export default (userId:number)=>{
    return useQuery({
        queryKey:['USER',userId.toString(),'FAV-WORKS'],
        queryFn:async ()=> await getFavWorks(userId)
    })
}