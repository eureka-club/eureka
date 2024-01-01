import { INVALID_FIELD, SERVER_ERROR } from "@/src/api_codes";
import { posts } from "@/src/facades/work";
import { NextRequest, NextResponse } from "next/server";

interface Props{
    params:{id:number}
}
export const GET = async (req:NextRequest,props:Props)=>{
  try {
      const {id} = props.params;
      const idNum = parseInt(id.toString(), 10);
      if (isNaN(idNum)) {
        return NextResponse.json({ error: INVALID_FIELD("ID") });
      }
      const ps = await posts(idNum);
      return NextResponse.json({posts:ps});
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      return NextResponse.json({ error: SERVER_ERROR });
    } finally {
      //prisma.$disconnect();
    }
}
export const dynamic = "force-dynamic";
export const revalidate = 60*60 