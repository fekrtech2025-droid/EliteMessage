const port = Number(process.env.PORT || process.env.API_PORT || 3002);
process.env.API_PORT = String(port);

require('./dist/main.js');
