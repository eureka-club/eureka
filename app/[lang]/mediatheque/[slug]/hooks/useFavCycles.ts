import { useQuery } from "@tanstack/react-query"
// import favCycles from "../actions/favCycles"
import { CycleMosaicItem } from "@/src/types/cycle"

export const getFavCycles = async (userId:number):Promise<CycleMosaicItem[]>=>{
    const url = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/api/user/${userId}/favCycles`;
    const fr = await fetch(url);
    if(fr.ok){
        const {favCycles}=await fr.json();
        return favCycles;
    }
    return [];
}
export default (userId:number)=>{
    return useQuery({
        queryKey:['USER',userId.toString(),'FAV-CYCLES'],
        queryFn:async ()=> await getFavCycles(userId)
    })
}