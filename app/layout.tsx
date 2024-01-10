import './globals.css'
//import type { Metadata } from 'next'
//import { Inter } from 'next/font/google'
//const inter = Inter({ subsets: ['latin'] })
import { Locale, i18n } from 'i18n-config'
import '@/src/scss/custom.scss';
import Layout from '@/src/components/layout/Layout';
import { getDictionary } from '@/src/get-dictionary';
import { LANGUAGES } from '@/src/constants';

// export async function generateStaticParams() {
//   return i18n.locales.map((locale) => ({ lang: locale }))
// }


export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode,
  params: { lang: Locale }
}) {
  // const session = await getServerSession(auth_config(params.lang));
  // const langs = (session?.user.language ?? params.lang)?.split(',').map(l=>LANGUAGES[l]).join(',');
  
  const dictionary = await getDictionary(params.lang);
  const dict: Record<string, string> = { ...dictionary['meta'], ...dictionary['common'],
  ...dictionary['topics'], ...dictionary['navbar'], ...dictionary['signInForm'],...dictionary['termsAndPolicy'],...dictionary['manifest'],...dictionary['aboutUs'] }

  return (
    <html lang={params.lang}>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/logo.svg" />
        <link rel="icon" type="image/svg" sizes="32x32" href="/logo.svg" />
        <link rel="icon" type="image/svg" sizes="16x16" href="/logo.svg" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/logo.svg" color="#3cd1b3" />
        <meta name="msapplication-TileColor" content="#2d89ef" />
        <meta name="theme-color" content="#ffffff" />
        {/* webfont(s) */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <meta name="google-site-verification" content="DQ6vv8bgVIsNmgpKCdmmvahFJd6-OhWGRhoqjGyW14A" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      </head>
      <body>
          {children}
      </body>
    </html>
  )
}
