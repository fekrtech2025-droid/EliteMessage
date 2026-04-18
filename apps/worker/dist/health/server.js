"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startHealthServer = startHealthServer;
const node_http_1 = require("node:http");
function startHealthServer(port) {
    const server = (0, node_http_1.createServer)((request, response) => {
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
    return new Promise((resolve) => {
        server.listen(port, () => {
            const address = server.address();
            resolve({
                port: address.port,
                close: () => new Promise((closeResolve, closeReject) => {
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
    });
}
//# sourceMappingURL=server.js.map