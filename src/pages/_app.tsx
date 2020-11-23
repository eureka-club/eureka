import { Provider } from 'jotai';
import { AppProps } from 'next/app';
import { Provider as NextAuthProvider } from 'next-auth/client';
import { StrictMode, FunctionComponent } from 'react';
import { QueryCache, ReactQueryCacheProvider } from 'react-query';

import navbarAtom from '../atoms/navbar';
import './_app.css';

const queryCache = new QueryCache();

const App: FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  const { initialState } = pageProps;

  return (
    <StrictMode>
      <NextAuthProvider session={pageProps.session}>
        <Provider initialValues={initialState && [[navbarAtom, initialState]]}>
          <ReactQueryCacheProvider queryCache={queryCache}>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Component {...pageProps} />
          </ReactQueryCacheProvider>
        </Provider>
      </NextAuthProvider>
    </StrictMode>
  );
};

export default App;
