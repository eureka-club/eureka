import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  if(request.nextUrl.pathname.match(/\/api\/[cycle|work|post|user]/g)){
    console.log("executed in ", request.url)
  }
  return response;
}