import { WEBAPP_URL } from "../constants"
import { UserDetail } from "../types/user";

export const getCycleParticipants=async(id:number):Promise<UserDetail[]>=>{
    const fr = await fetch(`${WEBAPP_URL}/api/cycle/${id}/participants`);
    if(fr.ok){
        const {participants} = await fr.json();
        return participants;
    }
    return [];
}