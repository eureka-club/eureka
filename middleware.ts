// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

// If the incoming request has the "beta" cookie
// then we'll rewrite the request to /beta
export function middleware(req: NextRequest) {
  debugger;
  if(req.nextUrl.pathname.match(/undefined\/api/g)){
    const url = req.nextUrl.pathname.replace("/undefined","")
    return NextResponse.redirect(url)
  }
  return NextResponse.rewrite(req.nextUrl);
}

export const config = {
  matcher: '/undefined',
};
