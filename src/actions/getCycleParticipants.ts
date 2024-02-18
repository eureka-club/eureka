import { WEBAPP_URL } from "../constants"
import { UserSumary } from "../types/UserSumary";

export const getCycleParticipants=async(id:number):Promise<UserSumary[]>=>{
    const fr = await fetch(`${WEBAPP_URL}/api/cycle/${id}/participants`);
    if(fr.ok){
        const {participants} = await fr.json();
        return participants;
    }
    return [];
}