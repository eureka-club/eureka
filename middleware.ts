import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const host = req.headers.get('host');
  console.log('ver host',req.headers.get('host'))

  if(host?.match('^eureka.club')){
    return NextResponse.redirect(`https://www.eureka.club${req.nextUrl.pathname}`, 301);
  }
  return NextResponse.next();
}