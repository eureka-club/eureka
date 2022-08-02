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

import  ErrorBoundary from '@/src/ErrorBounddary';
import { NotificationProvider } from '@/src/useNotificationProvider';
import {ModalProvider} from '@/src/useModal'
const App: FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  const { initialState } = pageProps;

  
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
     {/* <ToastProvider placement='top-center' components={{ Toast: ToastNew }} autoDismissTimeout={5000}> */}
     <SSRProvider>
        <NextAuthProvider session={pageProps.session} refetchInterval={5 * 60}>
            
          {/* <GlobalEventsContext.Provider value={{...gec}}> */}
              <Provider initialValues={initialState && [[detailPagesAtom, globalModalsAtom, initialState]]}>
                <QueryClientProvider client={queryClient}>

                  <Hydrate state={pageProps.dehydratedState}>
                    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                    <ModalProvider>
                      <NotificationProvider>
                        {/* <ErrorBoundary> */}
                          <Component {...pageProps} />
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
    {/* </ToastProvider> */}
    </StrictMode>
  );
};

// @ts-ignore
export default App;
// export default appWithI18n(App, { ...i18nConfig, skipInitialProps: false });
