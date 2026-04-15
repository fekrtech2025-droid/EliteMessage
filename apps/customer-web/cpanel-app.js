/* global __dirname, process, require */
/* eslint-disable @typescript-eslint/no-require-imports */

const path = require('node:path');

const port = Number(process.env.PORT || process.env.CUSTOMER_WEB_PORT || 3000);
process.env.PORT = String(port);
process.env.CUSTOMER_WEB_PORT = String(port);
process.env.HOSTNAME = process.env.HOSTNAME || '0.0.0.0';

require(
  path.join(
    __dirname,
    '.next',
    'standalone',
    'apps',
    'customer-web',
    'server.js',
  ),
);
