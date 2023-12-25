import { SERVER_ERROR } from "@/src/api_codes";
import { NextRequest, NextResponse } from "next/server";
import { search } from "@/src/facades/cycle";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const where = searchParams.get("where");
  let props = <any>{};

  if (q!) props.q = q;
  if (where!) props.where = where;

  if (Object.entries(props)) {
    const cycles = await search(props);
    return NextResponse.json(cycles);
  } else return NextResponse.json([]);

  //throw new Error("[412] Query parameter(s) missing");
}
