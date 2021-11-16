/* eslint-disable react/no-danger */
import Document, { Html, Head, Main, NextScript } from 'next/document';

import { CLARITY_TRACKING_ID } from '../src/constants';

class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html>
        <Head>
          {/* favicon */}
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
          <link
            rel="preload"
            href="https://fonts.gstatic.com/s/opensans/v18/mem8YaGs126MiZpBA-UFVZ0bf8pkAg.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="https://fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UNirkOUuhpKKSTjw.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,600;1,400;1,600&display=swap"
          />
          {/* Google Tag Manager */}
          {/* <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-W4VFV99');`,
            }}
          />
 */}
          {/* End Google Tag Manager */}
          {/* MS Clarity analytics */}
          {CLARITY_TRACKING_ID != null && (
            <>
              <script
                dangerouslySetInnerHTML={{
                  __html: `window.clarity = window.clarity || function() { (window.clarity.q = window.clarity.q || []).push(arguments) };`,
                }}
              />
              <script async src={`https://www.clarity.ms/tag/${CLARITY_TRACKING_ID}`} />
            </>
          )}
          {/* <!-- Facebook Pixel Code --> */}
          <>
            <script
              dangerouslySetInnerHTML={{
                __html: `!function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '599663694569948');
                  fbq('track', 'PageView');
                  `,
              }}
            />
          </>
          {/* <!-- End Facebook Pixel Code --> */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
