import { search } from '@/src/facades/work';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (q) {
    const works = await search({q:q});
    return NextResponse.json({works});
  }

  throw new Error("[412] Query parameter(s) missing");
}
