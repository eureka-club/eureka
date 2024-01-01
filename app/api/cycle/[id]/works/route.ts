// import auth_config from "@/auth_config";
// import { getServerSession } from "next-auth";
import { INVALID_FIELD, SERVER_ERROR } from "@/src/api_codes";
import { works } from "@/src/facades/cycle";
// import getLocale from "@/src/getLocale";
import { NextRequest, NextResponse } from "next/server";

interface Props{
    params:{id:string}
}
export const GET = async (req:NextRequest,props:Props) => {
  // const locale = getLocale(req);
    // const session = await getServerSession(auth_config(locale));
    try {
      const {id} = props.params;

        const idNum = parseInt(id, 10);
        if (!Number.isInteger(idNum)) {
            return NextResponse.json({error:INVALID_FIELD('id')});
        }
        const ps = await works(+id);
        return NextResponse.json({ works: ps });
      }

     catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      return NextResponse.json({ error: SERVER_ERROR });
    } finally {
      ////prisma.$disconnect();
    }
}
export const dynamic = "force-dynamic";
export const revalidate = 60*60;