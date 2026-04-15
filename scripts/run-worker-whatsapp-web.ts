import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { loadWorkspaceEnv } from '@elite-message/config';

const browserCandidates = [
  process.env.WORKER_WA_BROWSER_EXECUTABLE_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
].filter((value): value is string => Boolean(value));

function resolveBrowserExecutablePath() {
  return browserCandidates.find((candidate) => existsSync(candidate)) ?? null;
}

function main() {
  loadWorkspaceEnv();
  const browserExecutablePath = resolveBrowserExecutablePath();

  if (!browserExecutablePath) {
    console.error('No supported Chromium-based browser was found.');
    console.error(
      'Set WORKER_WA_BROWSER_EXECUTABLE_PATH in /Volumes/MACOS/EliteMessage/.env.',
    );
    process.exit(1);
  }

  const runtimeRoot = resolve(
    '/Volumes/MACOS/EliteMessage',
    '.runtime',
    'worker-sessions',
  );
  const child = spawn(
    process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm',
    ['--filter', '@elite-message/worker', 'dev'],
    {
      cwd: '/Volumes/MACOS/EliteMessage',
      stdio: 'inherit',
      env: {
        ...process.env,
        WORKER_SESSION_BACKEND: 'whatsapp_web',
        WORKER_WA_BROWSER_EXECUTABLE_PATH: browserExecutablePath,
        WORKER_SESSION_STORAGE_DIR:
          process.env.WORKER_SESSION_STORAGE_DIR ?? runtimeRoot,
      },
    },
  );

  child.on('exit', (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }

    process.exit(code ?? 0);
  });
}

main();
