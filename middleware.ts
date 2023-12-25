import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { i18n } from '@/i18n-config'
import getLocale from '@/src/getLocale';



import { withAuth } from "next-auth/middleware"

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  async function middleware(request: NextRequest) {
    
    const pathname = request.nextUrl.pathname
    const searchParams = request.nextUrl.searchParams;
    
    const PUBLIC_FILE = /\.(.*)$/;
    
    if (
      pathname.startsWith("/static") || // exclude static files
      PUBLIC_FILE.test(pathname) // exclude all files in the public folder
      )
      return NextResponse.next();
      // Check if there is any supported locale in the pathname
      const pathnameIsMissingLocale = i18n.locales.every(
        (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
        )
        
        const token = (request as NextRequest&{nextauth:{token:{locale:string}}}).nextauth.token;
      if (pathnameIsMissingLocale||(token?.locale && !pathname.startsWith(`/${token?.locale}`))) {
        
        if(token?.locale){
          let bp=pathname;  
          if(!pathnameIsMissingLocale){
              i18n.locales.forEach(l=>{
                bp=bp.replaceAll(`/${l}`,'');
              })
            } 
            return NextResponse.redirect(
              new URL(
                `/${token?.locale??'pt'}${bp??(bp||'/')}?${searchParams}`,
                request.url
              )
            )
        }
  
      const locale = getLocale(request)
      return NextResponse.redirect(
        new URL(
          `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}?${searchParams}`,
          request.url
        )
      )
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => true,
    },
  }
)

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}