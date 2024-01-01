import { CycleMosaicItem } from "@/src/types/cycle";
import { useQuery } from "@tanstack/react-query"
// import cyclesCreated from "../actions/cyclesCreated"

export const getCyclesCreated = async (userId:number):Promise<CycleMosaicItem[]>=>{
    const url = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/api/user/${userId}/cyclesCreated`;
    const fr = await fetch(url);
    if(fr.ok){
        const {cycles} = await fr.json();
        return cycles;
    }
    return [];
}
export default (userId:number)=>{
    return useQuery({
        queryKey:['USER',userId.toString(),'CYCLES-CREATED'],
        queryFn:async ()=> await getCyclesCreated(userId)
    })
}