/* global __dirname, process, require */
/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');

const port = Number(process.env.PORT || process.env.CUSTOMER_WEB_PORT || 3000);
process.env.PORT = String(port);
process.env.CUSTOMER_WEB_PORT = String(port);
process.env.HOSTNAME = '0.0.0.0';
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const bundleRoot = path.join(__dirname, 'cpanel-bundle');
const serverEntry = path.join(bundleRoot, 'apps', 'customer-web', 'server.js');
const bundleNodeModules = path.join(bundleRoot, 'node_modules');

if (!fs.existsSync(serverEntry)) {
  throw new Error(
    'Unable to find the customer-web cPanel bundle. Pull the latest repo and redeploy it.',
  );
}

process.env.NODE_PATH = process.env.NODE_PATH
  ? `${bundleNodeModules}${path.delimiter}${process.env.NODE_PATH}`
  : bundleNodeModules;
Module._initPaths();

require(serverEntry);
