/* global __dirname, process, require */
/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require('node:fs');
const path = require('node:path');

const port = Number(process.env.PORT || process.env.CUSTOMER_WEB_PORT || 3000);
process.env.PORT = String(port);
process.env.CUSTOMER_WEB_PORT = String(port);
process.env.HOSTNAME = process.env.HOSTNAME || '0.0.0.0';
const runtimeRoot =
  process.env.ELITEMESSAGE_RUNTIME_ROOT ||
  '/home/levanpms/elite-message-runtime/customer-web';

const runtimeCandidates = [
  path.join(runtimeRoot, 'server.js'),
  path.join(runtimeRoot, 'apps', 'customer-web', 'server.js'),
  path.join(__dirname, '.next', 'standalone', 'server.js'),
  path.join(
    __dirname,
    '.next',
    'standalone',
    'apps',
    'customer-web',
    'server.js',
  ),
];

const serverEntry = runtimeCandidates.find((candidate) =>
  fs.existsSync(candidate),
);

if (!serverEntry) {
  throw new Error(
    'Unable to find the customer-web standalone server. Run the cPanel deployment again.',
  );
}

require(serverEntry);
