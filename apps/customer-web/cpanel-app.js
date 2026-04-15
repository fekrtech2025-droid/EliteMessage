const http = require('node:http');
const next = require('next');
const { loadWorkspaceEnv } = require('@elite-message/config');

loadWorkspaceEnv(__dirname);
const port = Number(process.env.PORT || process.env.CUSTOMER_WEB_PORT || 3000);
process.env.CUSTOMER_WEB_PORT = String(port);

const app = next({
  dev: false,
  dir: __dirname,
  hostname: '0.0.0.0',
  port,
});

const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    http
      .createServer((request, response) => handle(request, response))
      .listen(port, '0.0.0.0', () => {
        console.log(`customer-web started on port ${port}`);
      });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
