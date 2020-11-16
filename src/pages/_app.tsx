import { AppProps } from 'next/app';
import { StrictMode, FunctionComponent } from 'react';
import { QueryCache, ReactQueryCacheProvider } from 'react-query';

import './_app.css';

const queryCache = new QueryCache();

const App: FunctionComponent<AppProps> = ({ Component, pageProps }) => (
  <StrictMode>
    <ReactQueryCacheProvider queryCache={queryCache}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Component {...pageProps} />
    </ReactQueryCacheProvider>
  </StrictMode>
);

export default App;
