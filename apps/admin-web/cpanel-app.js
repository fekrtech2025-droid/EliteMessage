/* global __dirname, process, require */
/* eslint-disable @typescript-eslint/no-require-imports */

const path = require('node:path');

const port = Number(process.env.PORT || process.env.ADMIN_WEB_PORT || 3001);
process.env.PORT = String(port);
process.env.ADMIN_WEB_PORT = String(port);
process.env.HOSTNAME = process.env.HOSTNAME || '0.0.0.0';

require(
  path.join(__dirname, '.next', 'standalone', 'apps', 'admin-web', 'server.js'),
);
