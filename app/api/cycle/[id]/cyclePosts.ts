import { posts as cyclePosts } from "@/src/facades/cycle";
import { NextRequest, NextResponse } from "next/server";

interface Props{
    searchParams:{
        id:string;
    }
}
export const GET = async (req:NextRequest,{searchParams}:Props)=>{
    const {id:id_}=searchParams;
    const id = +id_;
    const posts = await cyclePosts(id);
    return NextResponse.json({posts});
}