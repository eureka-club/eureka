import { Provider } from 'jotai';
import { AppProps } from 'next/app';
import { StrictMode, FunctionComponent } from 'react';
import { QueryCache, ReactQueryCacheProvider } from 'react-query';

import navbarAtom from '../atoms/navbar';
import './_app.css';

const queryCache = new QueryCache();

const App: FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  const { initialState } = pageProps;

  return (
    <StrictMode>
      <Provider initialValues={initialState && [[navbarAtom, initialState]]}>
        <ReactQueryCacheProvider queryCache={queryCache}>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Component {...pageProps} />
        </ReactQueryCacheProvider>
      </Provider>
    </StrictMode>
  );
};

export default App;
