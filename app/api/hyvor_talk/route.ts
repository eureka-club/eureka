import { SERVER_ERROR } from "@/src/api_codes";
import { NextRequest, NextResponse } from "next/server";

const apiKey = process.env.HYVOR_TALK_API_KEY;

export const GET = async (req: NextRequest) => {
   try {
     const { searchParams } = new URL(req.url);
     const id = searchParams.get("id");
     let r = await fetch(
       `https://talk.hyvor.com/api/v1/comments?website_id=3377&api_key=${apiKey}&sort=most_upvoted&page_identifier=${id}`
     );
     let data = await r.json();
     //console.log(r,'r')
     //if(r.data){
     return NextResponse.json({ data: data });
     //    }
   } catch (e) {
    return NextResponse.json({ status: SERVER_ERROR });
   }

};

export const dynamic = "force-dynamic";
export const revalidate = 60 * 60; 
