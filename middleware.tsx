import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const host = req.headers.get('host');
  if(host?.match('https://eureka.club')){
    return NextResponse.redirect(`https://www.eureka.club`, 301);
  }
  return NextResponse.next();
}