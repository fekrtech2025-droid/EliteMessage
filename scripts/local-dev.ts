import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { userInfo } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = dirname(fileURLToPath(import.meta.url));
export const workspaceRoot = resolve(currentDir, '..');

type LocalEnv = {
  POSTGRES_HOST: string;
  POSTGRES_PORT: string;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_DB: string;
  REDIS_URL: string;
  REDIS_PORT: string;
  S3_ENDPOINT: string;
  S3_PORT: string;
  S3_ACCESS_KEY: string;
  S3_SECRET_KEY: string;
  S3_BUCKET: string;
};

function parseEnvFile(filePath: string): Record<string, string> {
  if (!existsSync(filePath)) {
    return {};
  }

  const values: Record<string, string> = {};
  const content = readFileSync(filePath, 'utf8');

  for (const rawLine of content.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    const separatorIndex = line.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();
    values[key] = rawValue.replace(/^['"]|['"]$/g, '');
  }

  return values;
}

export function loadLocalEnv(): LocalEnv {
  return {
    ...parseEnvFile(resolve(workspaceRoot, '.env.example')),
    ...parseEnvFile(resolve(workspaceRoot, '.env')),
    ...process.env,
  } as LocalEnv;
}

export function commandExists(command: string): boolean {
  return (
    spawnSync('zsh', ['-lc', `command -v ${command}`], { stdio: 'ignore' })
      .status === 0
  );
}

export function runCapture(
  command: string,
  args: string[],
  options?: { env?: NodeJS.ProcessEnv; cwd?: string },
) {
  return spawnSync(command, args, {
    cwd: options?.cwd ?? workspaceRoot,
    env: options?.env ?? process.env,
    encoding: 'utf8',
  });
}

export function runOrThrow(
  command: string,
  args: string[],
  options?: {
    env?: NodeJS.ProcessEnv;
    cwd?: string;
    stdio?: 'inherit' | 'pipe';
  },
) {
  const result = spawnSync(command, args, {
    cwd: options?.cwd ?? workspaceRoot,
    env: options?.env ?? process.env,
    encoding: 'utf8',
    stdio: options?.stdio ?? 'pipe',
  });

  if (result.status !== 0) {
    throw new Error(
      [
        `Command failed: ${command} ${args.join(' ')}`,
        result.stdout,
        result.stderr,
      ]
        .filter(Boolean)
        .join('\n'),
    );
  }

  return result;
}

export async function sleep(ms: number) {
  await new Promise((resolvePromise) => setTimeout(resolvePromise, ms));
}

export async function waitFor(
  check: () => boolean | Promise<boolean>,
  label: string,
  attempts = 20,
  delayMs = 1_000,
) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    if (await check()) {
      return;
    }

    await sleep(delayMs);
  }

  throw new Error(`Timed out waiting for ${label}`);
}

export function ensureDir(path: string) {
  mkdirSync(path, { recursive: true });
}

export function quoteLiteral(value: string): string {
  return value.replace(/'/g, "''");
}

function localPath(...segments: string[]) {
  return resolve(workspaceRoot, '.local', ...segments);
}

export function isPostgresReady(env: LocalEnv) {
  const result = runCapture(
    'psql',
    [
      '-h',
      env.POSTGRES_HOST,
      '-p',
      env.POSTGRES_PORT,
      '-d',
      'postgres',
      '-c',
      'select 1;',
    ],
    {
      env: {
        ...process.env,
        PGUSER: userInfo().username,
      },
    },
  );

  return result.status === 0;
}

export async function ensurePostgresService(env: LocalEnv) {
  if (isPostgresReady(env)) {
    return;
  }

  if (commandExists('brew')) {
    const formulaCandidates = [
      'postgresql@14',
      'postgresql@17',
      'postgresql@16',
    ];
    for (const formula of formulaCandidates) {
      const result = runCapture('brew', ['list', '--versions', formula]);
      if (result.status === 0 && result.stdout.trim()) {
        runOrThrow('brew', ['services', 'start', formula], {
          stdio: 'inherit',
        });
        break;
      }
    }
  }

  await waitFor(() => isPostgresReady(env), 'PostgreSQL');
}

export async function ensureLocalDatabase(env: LocalEnv) {
  const localHosts = new Set(['localhost', '127.0.0.1', '::1']);
  if (!localHosts.has(env.POSTGRES_HOST)) {
    return;
  }

  await ensurePostgresService(env);

  const roleSql = `
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${quoteLiteral(env.POSTGRES_USER)}') THEN
    EXECUTE 'CREATE ROLE "${env.POSTGRES_USER}" LOGIN SUPERUSER PASSWORD ''${quoteLiteral(env.POSTGRES_PASSWORD)}''';
  ELSE
    EXECUTE 'ALTER ROLE "${env.POSTGRES_USER}" WITH LOGIN SUPERUSER PASSWORD ''${quoteLiteral(env.POSTGRES_PASSWORD)}''';
  END IF;
END
$$;`;

  runOrThrow(
    'psql',
    [
      '-h',
      env.POSTGRES_HOST,
      '-p',
      env.POSTGRES_PORT,
      '-d',
      'postgres',
      '-v',
      'ON_ERROR_STOP=1',
      '-c',
      roleSql,
    ],
    {
      env: {
        ...process.env,
        PGUSER: userInfo().username,
      },
    },
  );

  const dbExists =
    runOrThrow(
      'psql',
      [
        '-h',
        env.POSTGRES_HOST,
        '-p',
        env.POSTGRES_PORT,
        '-d',
        'postgres',
        '-tAc',
        `SELECT 1 FROM pg_database WHERE datname = '${quoteLiteral(env.POSTGRES_DB)}'`,
      ],
      {
        env: {
          ...process.env,
          PGUSER: userInfo().username,
        },
      },
    ).stdout.trim() === '1';

  if (!dbExists) {
    runOrThrow(
      'createdb',
      [
        '-h',
        env.POSTGRES_HOST,
        '-p',
        env.POSTGRES_PORT,
        '-O',
        env.POSTGRES_USER,
        env.POSTGRES_DB,
      ],
      {
        env: {
          ...process.env,
          PGUSER: userInfo().username,
        },
      },
    );
  }
}

export function isRedisReady(env: LocalEnv) {
  const result = runCapture('redis-cli', ['-u', env.REDIS_URL, 'ping']);
  return result.status === 0 && result.stdout.includes('PONG');
}

export async function ensureRedisService(env: LocalEnv) {
  if (isRedisReady(env)) {
    return;
  }

  ensureDir(localPath('redis'));
  ensureDir(localPath('run'));
  ensureDir(localPath('logs'));

  runOrThrow('redis-server', [
    '--daemonize',
    'yes',
    '--bind',
    '127.0.0.1',
    '--port',
    env.REDIS_PORT,
    '--dir',
    localPath('redis'),
    '--pidfile',
    localPath('run', 'redis.pid'),
    '--logfile',
    localPath('logs', 'redis.log'),
    '--save',
    '',
    '--appendonly',
    'no',
  ]);

  await waitFor(() => isRedisReady(env), 'Redis');
}

async function isMinioHealthy(endpoint: string) {
  try {
    const response = await fetch(new URL('/minio/health/live', endpoint), {
      signal: AbortSignal.timeout(2_000),
    });

    return response.ok;
  } catch {
    return false;
  }
}

export async function ensureMinioBinary() {
  const binDir = localPath('bin');
  const minioBinary = resolve(binDir, 'minio');

  if (
    existsSync(minioBinary) &&
    runCapture(minioBinary, ['--version']).status === 0
  ) {
    return minioBinary;
  }

  ensureDir(binDir);
  runOrThrow(
    'curl',
    [
      '-L',
      '--fail',
      '--retry',
      '5',
      '--retry-delay',
      '5',
      '--retry-all-errors',
      '--continue-at',
      '-',
      '--speed-time',
      '30',
      '--speed-limit',
      '1024',
      'https://dl.min.io/server/minio/release/darwin-arm64/minio',
      '--output',
      minioBinary,
    ],
    {
      stdio: 'inherit',
    },
  );
  runOrThrow('chmod', ['+x', minioBinary]);

  if (runCapture(minioBinary, ['--version']).status !== 0) {
    throw new Error('Downloaded MinIO binary did not pass a version check.');
  }

  return minioBinary;
}

export async function ensureMinioService(env: LocalEnv) {
  if (await isMinioHealthy(env.S3_ENDPOINT)) {
    return;
  }

  if ((process.env.ELITE_STORAGE_MODE ?? 'mock') !== 'minio') {
    ensureDir(localPath('run'));
    const child = spawn(
      resolve(workspaceRoot, 'node_modules', '.bin', 'tsx'),
      [resolve(workspaceRoot, 'scripts', 'storage-mock.ts')],
      {
        cwd: workspaceRoot,
        detached: true,
        stdio: 'ignore',
        env: {
          ...process.env,
          S3_ENDPOINT: env.S3_ENDPOINT,
          S3_PORT: env.S3_PORT,
          S3_BUCKET: env.S3_BUCKET,
        },
      },
    );

    child.unref();
    writeFileSync(localPath('run', 'storage-mock.pid'), `${child.pid}\n`);
    await waitFor(
      () => isMinioHealthy(env.S3_ENDPOINT),
      'storage mock',
      30,
      1_000,
    );
    return;
  }

  const minioBinary = await ensureMinioBinary();
  ensureDir(localPath('minio', 'data'));
  ensureDir(localPath('run'));

  const child = spawn(
    minioBinary,
    [
      'server',
      localPath('minio', 'data'),
      '--address',
      `:${env.S3_PORT}`,
      '--console-address',
      ':9001',
    ],
    {
      cwd: workspaceRoot,
      detached: true,
      stdio: ['ignore', 'ignore', 'ignore'],
      env: {
        ...process.env,
        MINIO_ROOT_USER: env.S3_ACCESS_KEY,
        MINIO_ROOT_PASSWORD: env.S3_SECRET_KEY,
      },
    },
  );

  child.unref();
  writeFileSync(localPath('run', 'minio.pid'), `${child.pid}\n`);

  await waitFor(() => isMinioHealthy(env.S3_ENDPOINT), 'MinIO', 30, 1_000);
}

export async function stopLocalServices() {
  const pidFiles = [
    localPath('run', 'storage-mock.pid'),
    localPath('run', 'minio.pid'),
    localPath('run', 'redis.pid'),
  ];

  for (const pidFile of pidFiles) {
    if (!existsSync(pidFile)) {
      continue;
    }

    const pid = readFileSync(pidFile, 'utf8').trim();
    if (!pid) {
      continue;
    }

    spawnSync('kill', [pid], { stdio: 'ignore' });
  }
}
