import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { config as loadDotenv } from 'dotenv';

export const runtimeDefaults = {
  logLevel: 'info',
  externalConnectionsEnabled: true,
  workerHeartbeatIntervalMs: 30_000,
} as const;

export function findWorkspaceRoot(startDir: string): string {
  let currentDir = startDir;

  while (true) {
    if (existsSync(resolve(currentDir, 'pnpm-workspace.yaml'))) {
      return currentDir;
    }

    const parentDir = dirname(currentDir);
    if (parentDir === currentDir) {
      return startDir;
    }

    currentDir = parentDir;
  }
}

export function loadWorkspaceEnv(startDir = process.cwd()): string[] {
  const workspaceRoot = findWorkspaceRoot(startDir);
  const loadedFiles: string[] = [];
  const skipExampleEnv =
    process.env.ELITEMESSAGE_SKIP_DOTENV_EXAMPLE === 'true';

  for (const fileName of [
    '.env',
    ...(skipExampleEnv ? [] : ['.env.example']),
  ]) {
    const filePath = resolve(workspaceRoot, fileName);
    if (!existsSync(filePath)) {
      continue;
    }

    loadDotenv({
      path: filePath,
      override: false,
      quiet: true,
    });
    loadedFiles.push(filePath);
  }

  return loadedFiles;
}
