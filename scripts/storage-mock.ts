import { createServer } from 'node:http';
import { ensureDir, loadLocalEnv, workspaceRoot } from './local-dev';
import { resolve } from 'node:path';
import { writeFileSync } from 'node:fs';

const env = loadLocalEnv();
const port = Number(env.S3_PORT);
const runDir = resolve(workspaceRoot, '.local', 'run');

ensureDir(runDir);

const server = createServer((request, response) => {
  if (request.url === '/minio/health/live') {
    response.writeHead(200, { 'content-type': 'text/plain' });
    response.end('OK');
    return;
  }

  response.writeHead(200, { 'content-type': 'application/json' });
  response.end(
    JSON.stringify({
      service: 'storage-mock',
      bucket: env.S3_BUCKET,
      path: request.url ?? '/',
      method: request.method ?? 'GET',
    }),
  );
});

server.listen(port, '127.0.0.1', () => {
  writeFileSync(resolve(runDir, 'storage-mock.pid'), `${process.pid}\n`);
});
