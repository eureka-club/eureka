"use server"

import { participants } from "@/src/facades/cycle"

export const getCycleParticipants = async (id:number)=>{
    const p = await participants(id);
    return p;
  }