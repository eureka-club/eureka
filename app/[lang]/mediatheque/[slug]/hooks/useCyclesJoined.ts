import { useQuery } from "@tanstack/react-query"
// import cyclesJoined from "../actions/joinedCycles"

export const getCyclesJoined = async (userId:number)=>{
    const url = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/api/user/${userId}/joinedCycles`;
    debugger;
    const fr = await fetch(url);
    if(fr.ok){
        const {joinedCycles} = await fr.json();
        return joinedCycles;
    }
    return [];
}
export default (userId:number)=>{
    return useQuery({
        queryKey:['USER',userId.toString(),'CYCLES-JOINED'],
        queryFn:async ()=> await getCyclesJoined(userId)
    })
}