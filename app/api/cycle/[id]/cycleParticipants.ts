import { participants as cycleParticipants} from "@/src/facades/cycle";
import { NextRequest, NextResponse } from "next/server";

interface Props{
    searchParams:{
        id:string;
    }
}
export const GET = async (req:NextRequest,{searchParams}:Props)=>{
    const {id:id_}=searchParams;
    const id = +id_;
    const participants = await cycleParticipants(id);
    return NextResponse.json({participants});
}