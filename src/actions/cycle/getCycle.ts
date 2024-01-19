"use server"

import { find } from "@/src/facades/cycle"

export const getCycle = async (id:number)=>{
    const cycle = await find(id);
    return cycle;
}