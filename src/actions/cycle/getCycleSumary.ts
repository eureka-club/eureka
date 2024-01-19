"use server"

import { findSumary } from "@/src/facades/cycle"

export const getCycleSumary = async (id:number)=>{
    const cycle = await findSumary(id);
    return cycle;
}