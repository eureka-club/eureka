import { Provider } from 'jotai';
import { AppProps } from 'next/app';
import { Provider as NextAuthProvider } from 'next-auth/client';
import appWithI18n from 'next-translate/appWithI18n';
import { StrictMode, FunctionComponent, useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Hydrate } from 'react-query/hydration';

import i18nConfig from '../i18n';
import detailPagesAtom from '../src/atoms/detailPages';
import globalModalsAtom from '../src/atoms/globalModals';
// import './_app.css';
import './scss/custom.scss';

// const queryClient = new QueryClient();
// import { GlobalEventsContext, useGlobalEventsContext } from '@/src/useGlobalEventsContext';
import { NotificationProvider } from '@/src/useNotificationProvider';


const App: FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  
  const { initialState } = pageProps;
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
      <NextAuthProvider session={pageProps.session}>
          
        {/* <GlobalEventsContext.Provider value={{...gec}}> */}
            <Provider initialValues={initialState && [[detailPagesAtom, globalModalsAtom, initialState]]}>
              <QueryClientProvider client={queryClient}>

                <Hydrate state={pageProps.dehydratedState}>
                  {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                  <NotificationProvider>
                    <Component {...pageProps} />
                  </NotificationProvider>
                </Hydrate>
                <ReactQueryDevtools />
              </QueryClientProvider>
            </Provider>
        {/* </GlobalEventsContext.Provider> */}
        
      </NextAuthProvider>
    </StrictMode>
  );
};

// @ts-ignore
export default appWithI18n(App, { ...i18nConfig, skipInitialProps: false });
