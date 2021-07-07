import { Provider } from 'jotai';
import { AppProps } from 'next/app';
import { Provider as NextAuthProvider } from 'next-auth/client';
import appWithI18n from 'next-translate/appWithI18n';
import { StrictMode, FunctionComponent, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';

import i18nConfig from '../i18n';
import detailPagesAtom from '../src/atoms/detailPages';
import globalModalsAtom from '../src/atoms/globalModals';
import './_app.css';

// const queryClient = new QueryClient();

const App: FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  const { initialState } = pageProps;
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      }),
  );
  return (
    <StrictMode>
      <NextAuthProvider session={pageProps.session}>
        <Provider initialValues={initialState && [[detailPagesAtom, globalModalsAtom, initialState]]}>
          <QueryClientProvider client={queryClient}>
            <Hydrate state={pageProps.dehydratedState}>
              {/* eslint-disable-next-line react/jsx-props-no-spreading */}
              <Component {...pageProps} />
            </Hydrate>
          </QueryClientProvider>
        </Provider>
      </NextAuthProvider>
    </StrictMode>
  );
};

// @ts-ignore
export default appWithI18n(App, { ...i18nConfig, skipInitialProps: false });
