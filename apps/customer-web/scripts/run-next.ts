import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { loadWorkspaceEnv, parseCustomerWebEnv } from '@elite-message/config';

const require = createRequire(import.meta.url);
const mode = process.argv[2];

if (mode !== 'dev' && mode !== 'start') {
  throw new Error(`Unsupported Next.js mode: ${mode ?? 'undefined'}`);
}

loadWorkspaceEnv();
const env = parseCustomerWebEnv(process.env);
const nextCli = require.resolve('next/dist/bin/next');
const nextArgs = [nextCli, mode];

if (mode === 'dev') {
  // Turbopack stalls on this mounted workspace path; webpack is slower but reliable.
  nextArgs.push('--webpack');
}

nextArgs.push('--port', String(env.CUSTOMER_WEB_PORT));

const child = spawn(process.execPath, nextArgs, {
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});

child.on('error', (error) => {
  console.error(error);
  process.exit(1);
});
