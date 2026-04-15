const port = Number(process.env.PORT || process.env.WORKER_PORT || 3003);
process.env.WORKER_PORT = String(port);

require('./dist/index.js');
