/* global __dirname, process, require */
/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require('node:fs');
const path = require('node:path');

const port = Number(process.env.PORT || process.env.ADMIN_WEB_PORT || 3001);
process.env.PORT = String(port);
process.env.ADMIN_WEB_PORT = String(port);
process.env.HOSTNAME = process.env.HOSTNAME || '0.0.0.0';

const runtimeCandidates = [
  '/home/levanpms/elite-message-runtime/admin-web/apps/admin-web/server.js',
  path.join(__dirname, '.next', 'standalone', 'apps', 'admin-web', 'server.js'),
];

const serverEntry = runtimeCandidates.find((candidate) =>
  fs.existsSync(candidate),
);

if (!serverEntry) {
  throw new Error(
    'Unable to find the admin-web standalone server. Run the cPanel deployment again.',
  );
}

require(serverEntry);
