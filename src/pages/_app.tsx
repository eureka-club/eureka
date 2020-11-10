import { AppProps } from 'next/app';
import { StrictMode, FunctionComponent } from 'react';

import './_app.css';

const App: FunctionComponent<AppProps> = ({ Component, pageProps }) => (
  <StrictMode>
    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
    <Component {...pageProps} />
  </StrictMode>
);

export default App;
