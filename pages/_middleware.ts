import type { NextFetchEvent, NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const { HOSTNAME_NON_WWW_PRODUCTION } = process.env;

export function middleware(req: NextRequest, ev: NextFetchEvent) {debugger;
    const {hostname, pathname, protocol} = req.nextUrl;
    if (hostname === HOSTNAME_NON_WWW_PRODUCTION && req.method === 'GET') {
        return NextResponse.redirect(`${protocol || 'http'}://www.${hostname}${pathname}`);        
    }  
}