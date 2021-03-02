import express from 'express';
import { existsSync, mkdirSync } from 'fs';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT != null ? parseInt(process.env.PORT, 10) : 3000;
const { NEXT_PUBLIC_LOCAL_ASSETS_BASE_URL, LOCAL_ASSETS_HOST_DIR } = process.env;

app.prepare().then(() => {
  const server = express();

  if (!dev) {
    server.use(({ hostname, method, path }, res, nextFn) => {
      if (method === 'GET' && hostname.slice(0, 3) !== 'www') {
        res.redirect(`https://www.${hostname}${path}`, 308);
        return;
      }

      nextFn();
    });
  }

  if (LOCAL_ASSETS_HOST_DIR != null && !existsSync(LOCAL_ASSETS_HOST_DIR)) {
    mkdirSync(LOCAL_ASSETS_HOST_DIR);
  }

  if (LOCAL_ASSETS_HOST_DIR != null && NEXT_PUBLIC_LOCAL_ASSETS_BASE_URL != null) {
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
