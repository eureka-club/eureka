import { Provider } from 'jotai';
import { AppProps } from 'next/app';
import { Provider as NextAuthProvider } from 'next-auth/client';
import appWithI18n from 'next-translate/appWithI18n';
import { StrictMode, FunctionComponent } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import i18nConfig from '../i18n';
import globalModalsAtom from '../src/atoms/globalModals';
import './_app.css';

const queryClient = new QueryClient();

const App: FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  const { initialState } = pageProps;

  return (
    <StrictMode>
      <NextAuthProvider session={pageProps.session}>
        <Provider initialValues={initialState && [[globalModalsAtom, initialState]]}>
          <QueryClientProvider client={queryClient}>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Component {...pageProps} />
          </QueryClientProvider>
        </Provider>
      </NextAuthProvider>
    </StrictMode>
  );
};

// @ts-ignore
export default appWithI18n(App, { ...i18nConfig, skipInitialProps: false });
