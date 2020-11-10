const express = require('express');
const fs = require('fs');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = parseInt(process.env.PORT, 10) || 3000;
const { NEXT_PUBLIC_LOCAL_ASSETS_BASE_URL, LOCAL_ASSETS_HOST_DIR } = process.env;

app.prepare().then(() => {
  const server = express();

  if (NEXT_PUBLIC_LOCAL_ASSETS_BASE_URL != null && LOCAL_ASSETS_HOST_DIR != null) {
    if (!fs.existsSync(LOCAL_ASSETS_HOST_DIR)) {
      fs.mkdirSync(LOCAL_ASSETS_HOST_DIR);
    }

    server.use(NEXT_PUBLIC_LOCAL_ASSETS_BASE_URL, express.static(LOCAL_ASSETS_HOST_DIR));
  }

  server.all('*', (req, res) => handle(req, res));
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
