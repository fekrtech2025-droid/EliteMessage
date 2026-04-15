/* global __dirname, console, process, require */
/* eslint-disable @typescript-eslint/no-require-imports */

const { spawn } = require('node:child_process');

const {
  loadWorkspaceEnv,
  parseCustomerWebEnv,
} = require('@elite-message/config');

const port = Number(process.env.PORT || process.env.CUSTOMER_WEB_PORT || 3000);
process.env.PORT = String(port);
process.env.CUSTOMER_WEB_PORT = String(port);
process.env.HOSTNAME = '0.0.0.0';
process.env.ELITEMESSAGE_SKIP_DOTENV_EXAMPLE =
  process.env.ELITEMESSAGE_SKIP_DOTENV_EXAMPLE || 'true';

loadWorkspaceEnv();
const env = parseCustomerWebEnv(process.env);
const nextCli = require.resolve('next/dist/bin/next');

const child = spawn(
  process.execPath,
  [
    nextCli,
    'start',
    '--hostname',
    process.env.HOSTNAME,
    '--port',
    String(env.CUSTOMER_WEB_PORT),
  ],
  {
    stdio: 'inherit',
    env: process.env,
    cwd: __dirname,
  },
);

child.on('exit', (code) => {
  process.exit(code ?? 0);
});

child.on('error', (error) => {
  console.error(error);
  process.exit(1);
});
