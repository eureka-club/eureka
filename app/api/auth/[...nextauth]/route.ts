import auth_config from "@/auth_config"
import { Locale } from "@/i18n-config"
import { getDictionary, t } from "@/src/get-dictionary"
import getLocale from "@/src/getLocale"
import { NextApiRequest, NextApiResponse } from "next"
import { AuthOptions, NextAuthOptions, User } from "next-auth"
import NextAuth from "next-auth/next"
import { NextRequest, NextResponse } from "next/server"

const handler = async (req:NextRequest,res:{params: { nextauth: string[] }})=>{
    const locale = getLocale(req);
    const {nextauth} = res.params;
    const nextAuthCallbackUrl = req.cookies.get('next-auth.callback-url')?.value;
    return NextAuth(req,res,auth_config(locale,nextauth,nextAuthCallbackUrl) as NextAuthOptions);
}
export { handler as GET, handler as POST }

// declare global {
//     namespace NodeJS {
//       export interface ProcessEnv {
//         NEXTAUTH_SECRET: string
//         GOOGLE_ID: string;
//         GOOGLE_SECRET: string
//       }
   
//     }
//   }
