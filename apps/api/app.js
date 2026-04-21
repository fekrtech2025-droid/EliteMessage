/* eslint-env node */
/* eslint-disable @typescript-eslint/no-require-imports */
/* global __dirname, process, require */
const { appendFileSync, mkdirSync } = require('node:fs');
const { dirname, isAbsolute, resolve } = require('node:path');

function isDebugEnabled() {
  return process.env.API_DEBUG_MODE === 'true';
}

function resolveDebugLogPath() {
  const configured = process.env.API_DEBUG_LOG_FILE;
  if (!configured || !configured.trim()) {
    return resolve(__dirname, 'api-debug.log');
  }

  return isAbsolute(configured) ? configured : resolve(__dirname, configured);
}

function serialize(value) {
  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack,
    };
  }

  return value;
}

function writeDebug(event, details = {}) {
  if (!isDebugEnabled()) {
    return;
  }

  try {
    const logPath = resolveDebugLogPath();
    mkdirSync(dirname(logPath), { recursive: true });
    appendFileSync(
      logPath,
      `${JSON.stringify({
        time: new Date().toISOString(),
        event,
        pid: process.pid,
        cwd: process.cwd(),
        details: serialize(details),
      })}\n`,
      'utf8',
    );
  } catch {
    // Ignore debug logging failures.
  }
}

try {
  writeDebug('app.wrapper.start', {
    argv: process.argv,
    envPort: process.env.PORT ?? null,
    envApiPort: process.env.API_PORT ?? null,
    nodeEnv: process.env.NODE_ENV ?? null,
  });
  process.chdir(__dirname);
  writeDebug('app.wrapper.chdir', { cwd: process.cwd() });
  require('./cpanel-app.js');
  writeDebug('app.wrapper.required_cpanel_app');
} catch (error) {
  writeDebug('app.wrapper.error', error);
  throw error;
}
