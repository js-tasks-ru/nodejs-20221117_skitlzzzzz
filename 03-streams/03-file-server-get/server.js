const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  const stream = fs.createReadStream(filepath);
  stream.pipe(res);

  stream.on('open', () => console.log('open'));
  stream.on('end', () => console.log('end'));

  switch (req.method) {
    case 'GET':
      if (error.code === 'ENOENT') {
        if (pathname.includes('/')) {
          res.statusCode = 400;
          res.end('incorrect req');
        } else {
          res.statusCode = 404;
          res.end('no such file');
        }
      } else {
        res.statusCode = 500;
        res.end('internal server error');
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }

  req.on('abort', () => {
    stream.destroy();
  });
});

module.exports = server;
