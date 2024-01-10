import type { NextRequest } from 'next/server'
import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { getServerSession } from 'next-auth'
import { LANGUAGES } from './constants'
import { Locale, i18n } from 'i18n-config'

// Negotiator expects plain object so we need to transform headers
export default function getLocale(request: NextRequest): Locale {
  
  // const session = await getServerSession(auth_config);
  // if(session?.user){
  //   const userLangs = session.user.language?.split(',').map(l=>LANGUAGES[l]);
  //   return matchLocale(userLangs!, i18n.locales, i18n.defaultLocale);
  // }
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  // @ts-ignore locales are readonly

  // Use negotiator and intl-localematcher to get best locale
  let languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    i18n.locales.map((l:Locale)=>l)
  )

  const locale = matchLocale(languages, i18n.locales, i18n.defaultLocale)

  return locale as Locale;
}