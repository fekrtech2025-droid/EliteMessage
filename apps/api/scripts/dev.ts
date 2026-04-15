import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const appRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const nodeBinary = process.execPath;

function startProcess(command: string, args: string[]) {
  return spawn(command, args, {
    cwd: appRoot,
    stdio: 'inherit',
    env: process.env,
  });
}

const compiler = startProcess('pnpm', [
  'exec',
  'tsc',
  '-w',
  '-p',
  'tsconfig.json',
  '--preserveWatchOutput',
]);
const runtime = startProcess(nodeBinary, ['--watch', 'dist/main.js']);

const shutdown = (signal: NodeJS.Signals) => {
  compiler.kill(signal);
  runtime.kill(signal);
};

compiler.on('exit', (code, signal) => {
  if (signal) {
    return;
  }

  runtime.kill('SIGTERM');
  process.exit(code ?? 0);
});

runtime.on('exit', (code, signal) => {
  if (signal) {
    return;
  }

  compiler.kill('SIGTERM');
  process.exit(code ?? 0);
});

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => {
    shutdown(signal);
  });
}
