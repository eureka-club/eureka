import { Provider,Atom } from 'jotai';
import { AppProps } from 'next/app';
import { SessionProvider as NextAuthProvider } from 'next-auth/react';
import { StrictMode, FunctionComponent, useState,useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import {SSRProvider} from 'react-bootstrap'
import { Hydrate } from 'react-query/hydration';
import { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/router';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';


import detailPagesAtom from '../src/atoms/detailPages';
// import globalModalsAtom from '../src/atoms/globalModals';

import './scss/custom.scss';
import { GTM_ID } from '@/src/lib/gtag'

import { NotificationProvider } from '@/src/useNotificationProvider';
import {ModalProvider} from '@/src/useModal'
import Script from 'next/script';
import { Session } from '@/src/types';
import Spinner from '@/src/components/Spinner';
const App: FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  let initialState : Iterable<readonly [Atom<unknown>, unknown]> | undefined = undefined
  let session:  Session | null | undefined = null
  let dehydratedState = null

function Loading() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
      const handleStart = (url: string) => /*(url !== router.asPath) && */ setLoading(true);
      const handleComplete = (url: string) => /*(url === router.asPath) && */setLoading(false)/*setTimeout(() =>{setLoading(false)},5000)*/;

      router.events.on('routeChangeStart', handleStart)
      router.events.on('routeChangeComplete', handleComplete)
      router.events.on('routeChangeError',  handleComplete)

      return () => {
          router.events.off('routeChangeStart', handleStart)
          router.events.off('routeChangeComplete', handleComplete)
          router.events.off('routeChangeError', handleComplete)
      }
  })
  
  return <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
         open={loading}
        //onClick={handleClose}
      >
        {/* <CircularProgress color="inherit" /> */}
        <Spinner/>
      </Backdrop>
}
  
  if('initialState' in pageProps){
    initialState = pageProps.initialState as  Iterable<readonly [Atom<unknown>, unknown]> | undefined;
  }
  if('session' in pageProps){
    session = pageProps.session as Session | null | undefined;
  }
  if('dehydratedState' in pageProps){
    dehydratedState = pageProps.dehydratedState;
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
  return (<>  
    <StrictMode>
     <SSRProvider>
        <NextAuthProvider session={session} refetchInterval={5 * 60}>
          <Loading/>  
          {/* <GlobalEventsContext.Provider value={{...gec}}> 
          //<Provider initialValues={initialState && [[detailPagesAtom, globalModalsAtom, initialState]]}>*/}
              <Provider initialValues={initialState && [[detailPagesAtom, initialState]]}>
                <QueryClientProvider client={queryClient}>

                  <Hydrate state={dehydratedState}>
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
</>

  ); 
};

// @ts-ignore
export default App;
// export default appWithI18n(App, { ...i18nConfig, skipInitialProps: false });
