import { SERVER_ERROR } from "@/src/api_codes";
import { findAll } from "@/src/facades/user";
import { NextResponse } from "next/server";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    let w = searchParams.get("where");
    let t = searchParams.get("take");
    let s = searchParams.get("skip");
    let c = searchParams.get("cursor");

    const where = w ? JSON.parse(decodeURIComponent(w.toString())) : undefined;
    const take = t ? parseInt(t?.toString()) : undefined;
    const skip = s ? parseInt(s.toString()) : undefined;
    const cursor = c ? JSON.parse(decodeURIComponent(c.toString())) : undefined;

    const data = await findAll({ where, take, skip, cursor });
    data.forEach((u) => {
      u.type = "user";
    });
    return NextResponse.json({
      data,
      fetched: data.length,
    });
  } catch (exc) {
    console.error(exc); // eslint-disable-line no-console
    return NextResponse.json({ error: SERVER_ERROR });
  } finally {
    //prisma.$disconnect();
  }
}

export const dynamic = 'force-dynamic'
export const revalidate = 60*60 
