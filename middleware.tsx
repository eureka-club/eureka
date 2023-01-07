import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const host = req.headers.get('host');
  if(host?.match('https://www.eureka-staging.azurewebsites.net')){
    return NextResponse.redirect(`https://eureka-staging.azurewebsites.net`, 301);
  }
  return NextResponse.next();
}