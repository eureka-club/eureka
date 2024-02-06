import { useQuery } from "@tanstack/react-query"
import { WEBAPP_URL } from "@/src/constants";
import { WorkSumary } from "@/src/types/work";

export const getReadOrWatchedWorks = async (userId:number):Promise<{work:WorkSumary|null,year:any}[]>=>{
    const url =`${WEBAPP_URL}/api/user/${userId}/readOrWatchedWorks`;
    const fr=await fetch(url);
    if(fr.ok){
        const {readOrWatchedWorks}=await fr.json();
        return readOrWatchedWorks as {work:WorkSumary|null,year:any}[];
    }
    return [];
}
export default (userId:number)=>{
    return useQuery({
        queryKey:['USER',userId.toString(),'POSTS-CREATED'],
        queryFn:async ()=> await getReadOrWatchedWorks(userId)
    })
}