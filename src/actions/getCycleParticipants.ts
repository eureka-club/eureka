import { WEBAPP_URL } from "../constants"
import { UserMosaicItem } from "../types/user";

export const getCycleParticipants=async(id:number):Promise<UserMosaicItem[]>=>{
    const fr = await fetch(`${WEBAPP_URL}/api/cycle/${id}/participants`);
    if(fr.ok){
        const {participants} = await fr.json();
        return participants;
    }
    return [];
}