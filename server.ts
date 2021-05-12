import express from 'express';
import { existsSync, mkdirSync } from 'fs';
import next from 'next';

import { STORAGE_MECHANISM_LOCAL_FILES } from './src/constants';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT != null ? parseInt(process.env.PORT, 10) : 3000;

const { LOCAL_ASSETS_HOST_DIR } = process.env;
const { NEXT_PUBLIC_LOCAL_ASSETS_BASE_URL } = process.env;
const { NEXT_PUBLIC_PUBLIC_ASSETS_STORAGE_MECHANISM } = process.env;

app.prepare().then(() => {
  const server = express();

  if (!dev) {
    server.use(({ hostname, method, path }, res, nextFn) => {
      if (method === 'GET' && hostname.slice(0, 3) !== 'www') {
        res.redirect(308, `https://www.${hostname}${path}`);
        return;
      }

      nextFn();
    });
  }

  if (
    NEXT_PUBLIC_PUBLIC_ASSETS_STORAGE_MECHANISM === STORAGE_MECHANISM_LOCAL_FILES &&
    LOCAL_ASSETS_HOST_DIR != null &&
    !existsSync(LOCAL_ASSETS_HOST_DIR)
  ) {
    mkdirSync(LOCAL_ASSETS_HOST_DIR);
  }

  if (
    NEXT_PUBLIC_PUBLIC_ASSETS_STORAGE_MECHANISM === STORAGE_MECHANISM_LOCAL_FILES &&
    LOCAL_ASSETS_HOST_DIR != null &&
    NEXT_PUBLIC_LOCAL_ASSETS_BASE_URL != null
  ) {
    server.use(
      NEXT_PUBLIC_LOCAL_ASSETS_BASE_URL,
      express.static(LOCAL_ASSETS_HOST_DIR, {
        etag: false,
        maxAge: dev ? '1h' : '180d',
      }),
    );
  }

  server.use((req, res) => handle(req, res));

  server.listen(port, () => {
    console.info(`> Ready on http://localhost:${port}`); // eslint-disable-line no-console
  });
});
