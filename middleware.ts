import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  if(req.nextUrl.pathname.match(/undefined\/api/g)){
    const href = req.nextUrl.href;
    const url = href.replace("/undefined","");
    return NextResponse.redirect(url)
  }
  return NextResponse.rewrite(req.nextUrl);
}

export const config = {
  matcher: '/undefined/api/:path*',
};