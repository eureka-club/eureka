import { useQuery } from "@tanstack/react-query"
import { CycleDetail } from "../types/cycle"
import { WEBAPP_URL } from "../constants"

export const getFavCycles = async (id:number):Promise<CycleDetail[]>=>{
    const url=`${WEBAPP_URL}/api/user/${id}/favCycles`;
    const fr=await fetch(url);
    if(fr.ok){
        const {favCycles}=await fr.json();
        return (favCycles as CycleDetail[]).map(c=>({...c,type:'cycle'}))
    }
    return [];
}
export default (userId:number,lang?:string)=>{
    return useQuery({
        queryKey:['USER',userId.toString(),'FAV-CYCLES'],
        queryFn:async ()=> await getFavCycles(userId)
    })
}