import { Provider } from 'jotai';
import { AppProps } from 'next/app';
import { SessionProvider as NextAuthProvider } from 'next-auth/react';
import { StrictMode, FunctionComponent, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import {SSRProvider} from 'react-bootstrap'
import { Hydrate } from 'react-query/hydration';
import { Toaster } from 'react-hot-toast';

import detailPagesAtom from '../src/atoms/detailPages';
import globalModalsAtom from '../src/atoms/globalModals';

import './scss/custom.scss';
import { GTM_ID, pageview } from '@/src/lib/gtag'

import  ErrorBoundary from '@/src/ErrorBounddary';
import { NotificationProvider } from '@/src/useNotificationProvider';
import {ModalProvider} from '@/src/useModal'
import Script from 'next/script';
const App: FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  let initialState = null
  if('initialState' in pageProps){
    initialState = pageProps.initialState;
  }
  const AnyComponent = Component as any;
  
  // const {Modal} = useModal()
  
  // const gec = useGlobalEventsContext();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            notifyOnChangeProps: 'tracked',
          },
        },
      }),
  );
  return (
    <StrictMode>
     <SSRProvider>
        <NextAuthProvider session={pageProps.session} refetchInterval={5 * 60}>
            
          {/* <GlobalEventsContext.Provider value={{...gec}}> */}
              <Provider initialValues={initialState && [[detailPagesAtom, globalModalsAtom, initialState]]}>
                <QueryClientProvider client={queryClient}>

                  <Hydrate state={pageProps.dehydratedState}>
                     {/* Google Tag Manager - Global base code */}
                  <Script
                    id="gtag-base"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                      __html: `
                        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                        })(window,document,'script','dataLayer', '${GTM_ID}');
                      `,
                    }}
                  />
                    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                    <ModalProvider>
                      <NotificationProvider>
                        {/* <ErrorBoundary> */}
                        
                          <AnyComponent {...pageProps} />
                        {/* </ErrorBoundary> */}
                      </NotificationProvider>
                    </ModalProvider>
                    <Toaster position="top-center" reverseOrder={false}/>
                  
                  </Hydrate>
                  <ReactQueryDevtools />
                </QueryClientProvider>
              </Provider>
          {/* </GlobalEventsContext.Provider> */}
          
        </NextAuthProvider>

     </SSRProvider>
    </StrictMode>
  );
};

// @ts-ignore
export default App;
// export default appWithI18n(App, { ...i18nConfig, skipInitialProps: false });
