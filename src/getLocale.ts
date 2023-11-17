import type { NextRequest } from 'next/server'
import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { Locale, i18n } from '../i18n-config'
import { NextApiRequest } from 'next'

// Negotiator expects plain object so we need to transform headers
export default async function getLocale(request: NextApiRequest): Promise<Locale> {
  
  // const session = await getServerSession(auth_config);
  // if(session?.user){
  //   const userLangs = session.user.language?.split(',').map(l=>LANGUAGES[l]);
  //   return matchLocale(userLangs!, i18n.locales, i18n.defaultLocale);
  // }
  const negotiatorHeaders: Record<string, string> = {}
  request.rawHeaders.forEach((value:any, key:any) => (negotiatorHeaders[key] = value))

  // @ts-ignore locales are readonly

  // Use negotiator and intl-localematcher to get best locale
  let languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    i18n.locales.map(l=>l)
  )

  const locale = matchLocale(languages, i18n.locales, i18n.defaultLocale)

  return locale as Locale;
}