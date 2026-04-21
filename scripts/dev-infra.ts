import {
  commandExists,
  ensureLocalDatabase,
  ensureMinioService,
  ensureMysqlService,
  ensureRedisService,
  loadLocalEnv,
  runOrThrow,
  stopLocalServices,
} from './local-dev';

const mode = process.argv[2] ?? 'start';

async function main() {
  if (mode === 'stop') {
    if (commandExists('docker')) {
      runOrThrow('docker', ['compose', 'down'], { stdio: 'inherit' });
    }

    await stopLocalServices();
    console.log('Stopped local infrastructure processes started by this repo.');
    return;
  }

  if (commandExists('docker')) {
    runOrThrow('docker', ['compose', 'up', '-d', 'mysql', 'redis', 'minio'], {
      stdio: 'inherit',
    });
    console.log('Infrastructure is running via Docker Compose.');
    return;
  }

  const env = loadLocalEnv();
  await ensureMysqlService(env);
  await ensureLocalDatabase(env);
  await ensureRedisService(env);
  await ensureMinioService(env);

  console.log('Infrastructure is running in local-service mode.');
  console.log(`MySQL: ${env.DATABASE_HOST}:${env.DATABASE_PORT}`);
  console.log(`Redis: ${env.REDIS_URL}`);
  console.log(`MinIO: ${env.S3_ENDPOINT}`);
}

void main();
