import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';

export function startHealthServer(port: number) {
  const server = createServer((request, response) => {
    if (request.url === '/health') {
      response.writeHead(200, { 'content-type': 'application/json' });
      response.end(JSON.stringify({ status: 'ok', service: 'worker' }));
      return;
    }

    if (request.url === '/ready') {
      response.writeHead(200, { 'content-type': 'application/json' });
      response.end(JSON.stringify({ ready: true, service: 'worker' }));
      return;
    }

    response.writeHead(404).end();
  });

  return new Promise<{ close: () => Promise<void>; port: number }>(
    (resolve) => {
      server.listen(port, () => {
        const address = server.address() as AddressInfo;
        resolve({
          port: address.port,
          close: () =>
            new Promise<void>((closeResolve, closeReject) => {
              server.close((error) => {
                if (error) {
                  closeReject(error);
                  return;
                }

                closeResolve();
              });
            }),
        });
      });
    },
  );
}
