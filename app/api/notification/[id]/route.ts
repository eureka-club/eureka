import { MISSING_FIELD, SERVER_ERROR } from "@/src/api_codes";
import { find } from "@/src/facades/notification";
import { NextRequest, NextResponse } from "next/server";

interface Props{
    params:{id:string}
}
export async function GET(req:NextRequest,props:Props) {
    try {
        const{id}=props.params;
        if(!id)return NextResponse.json({error:MISSING_FIELD('id')});
        let notification = await find(parseInt(id));
        return NextResponse.json({ notification });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      return NextResponse.json({ error: SERVER_ERROR });
    } finally {
      // //prisma.$disconnect();
    }
}