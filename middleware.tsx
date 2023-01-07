import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const host = req.headers.get('host');
  if(process.env.NODE_ENV!='development'){
    if(host?.match('www.eureka-staging.azurewebsites.net')){
      return NextResponse.redirect(`https://eureka-staging.azurewebsites.net`, 301);
    }
    else{
      if (host?.match(/^www\..*/i)) {
        return NextResponse.next();
      }
      else{
        return NextResponse.redirect(`https://www.${host}${req.nextUrl.pathname}`, 301);
      }
    }
  }
  return NextResponse.next();
}