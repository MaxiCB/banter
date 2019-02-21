const express = require('express');
const next = require('next');
const path = require('path');
const expressWS = require('express-ws');
const secure = require('express-force-https');
const cookiesMiddleware = require('universal-cookie-express');
require('dotenv').config();

const { setup } = require('radiks-server');
const { STREAM_CRAWL_EVENT } = require('radiks-server/app/lib/constants');
const makeApiController = require('./ApiController');
const notifier = require('../common/lib/notifier');

const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });
const handle = app.getRequestHandler();

const port = parseInt(process.env.PORT, 10) || 5000;

app.prepare().then(async () => {
  const server = express();
  server.use(cookiesMiddleware());
  server.use(secure);

  expressWS(server);

  const RadiksController = await setup();
  server.use('/radiks', RadiksController);

  server.use((req, res, _next) => {
    if (!dev && req.host !== 'banter.pub') {
      console.log('Redirecting from non-production URL:', req.host);
      return res.redirect('https://banter.pub');
    }
    return _next();
  });

  server.get('/manifest.json', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.sendFile(path.join(__dirname, '..', 'static', 'manifest.json'));
  });

  server.use('/api', makeApiController(RadiksController.db));

  server.get('*', (req, res) => handle(req, res));

  RadiksController.emitter.on(STREAM_CRAWL_EVENT, ([attrs]) => {
    notifier(RadiksController.DB, attrs);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
