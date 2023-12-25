
import { SERVER_ERROR } from "@/src/api_codes";
import { NextRequest, NextResponse } from "next/server";

import { flatten, isEmpty, zip } from "lodash";


import { Cycle } from "@prisma/client";
import getApiHandler from "@/src/lib/getApiHandler";
import { search as searchCycles } from "@/src/facades/cycle";
import { search as searchWorks } from "@/src/facades/work";
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (q!) {
    const cyclesAux = await searchCycles({ q: q });
    const cycles: (Cycle & { type: string })[] = cyclesAux.map((c) => ({
      ...c,
      type: "cycle",
    }));
    const works = await searchWorks({q:q});

    const interleavedResults = flatten(zip(cycles, works)).filter(
      (workOrCycle) => workOrCycle != null
    );
    return NextResponse.json(interleavedResults);
  }

  throw new Error("[412] Query parameter(s) missing");
}
