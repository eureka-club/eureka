import { CycleMosaicItem } from "@/src/types/cycle"
import { useQuery } from "@tanstack/react-query"

export const getWorkCycles = async (workId:number):Promise<CycleMosaicItem[]>=>{
    const url = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/api/work/${workId}/cycles`;
    const fr = await fetch(url);
    if(fr.ok){
        const {cycles}=await fr.json();
        return cycles;
    }
    return [];
}
export default (workId:number)=>{
    return useQuery({
        queryKey:['WORK',workId?.toString(),'CYCLES'],
        queryFn: async ()=>await getWorkCycles(workId),
        enabled:!!workId
    })
}