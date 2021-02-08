import { Provider } from 'jotai';
import { AppProps } from 'next/app';
import { Provider as NextAuthProvider } from 'next-auth/client';
import { StrictMode, FunctionComponent } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import 'reflect-metadata';

import homepageAtom from '../src/atoms/homepage';
import './_app.css';

const queryClient = new QueryClient();

const App: FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  const { initialState } = pageProps;

  return (
    <StrictMode>
      <NextAuthProvider session={pageProps.session}>
        <Provider initialValues={initialState && [[homepageAtom, initialState]]}>
          <QueryClientProvider client={queryClient}>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Component {...pageProps} />
          </QueryClientProvider>
        </Provider>
      </NextAuthProvider>
    </StrictMode>
  );
};

export default App;
