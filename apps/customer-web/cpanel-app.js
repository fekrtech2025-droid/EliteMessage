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
const sourceNextRoot = path.join(__dirname, '.next');
const sourceStandaloneRoot = path.join(sourceNextRoot, 'standalone');
const sourceStaticRoot = path.join(sourceNextRoot, 'static');
const sourcePublicRoot = path.join(__dirname, 'public');
const bundleAppRoot = path.join(bundleRoot, 'apps', 'customer-web');
const bundleNextRoot = path.join(bundleAppRoot, '.next');
const bundleStaticRoot = path.join(bundleNextRoot, 'static');
const bundlePublicRoot = path.join(bundleAppRoot, 'public');

function readOptionalFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8').trim();
  } catch {
    return null;
  }
}

function hasStaticChunks(staticRoot) {
  const chunksRoot = path.join(staticRoot, 'chunks');
  try {
    return fs
      .readdirSync(chunksRoot)
      .some((entry) => entry.endsWith('.js') || entry.endsWith('.css'));
  } catch {
    return false;
  }
}

function syncBundleFromStandalone() {
  if (!fs.existsSync(sourceStandaloneRoot)) {
    return;
  }

  fs.rmSync(bundleRoot, { recursive: true, force: true });
  fs.cpSync(sourceStandaloneRoot, bundleRoot, {
    recursive: true,
    force: true,
  });

  if (fs.existsSync(sourceStaticRoot)) {
    fs.mkdirSync(bundleNextRoot, { recursive: true });
    fs.rmSync(bundleStaticRoot, { recursive: true, force: true });
    fs.cpSync(sourceStaticRoot, bundleStaticRoot, {
      recursive: true,
      force: true,
    });
  }

  if (fs.existsSync(sourcePublicRoot)) {
    fs.rmSync(bundlePublicRoot, { recursive: true, force: true });
    fs.cpSync(sourcePublicRoot, bundlePublicRoot, {
      recursive: true,
      force: true,
    });
  }
}

function ensureBundleReady() {
  const sourceBuildId = readOptionalFile(path.join(sourceNextRoot, 'BUILD_ID'));
  const bundleBuildId = readOptionalFile(path.join(bundleNextRoot, 'BUILD_ID'));
  const bundleIsMissing = !fs.existsSync(serverEntry);
  const buildIdMismatch =
    Boolean(sourceBuildId && bundleBuildId) && sourceBuildId !== bundleBuildId;
  const staticChunksMissing = !hasStaticChunks(bundleStaticRoot);

  if (bundleIsMissing || buildIdMismatch || staticChunksMissing) {
    syncBundleFromStandalone();
  }
}

ensureBundleReady();

if (!fs.existsSync(serverEntry)) {
  throw new Error(
    'Unable to find the customer-web cPanel bundle. Build customer-web before restarting Passenger.',
  );
}

process.env.NODE_PATH = process.env.NODE_PATH
  ? `${bundleNodeModules}${path.delimiter}${process.env.NODE_PATH}`
  : bundleNodeModules;
Module._initPaths();

require(serverEntry);
