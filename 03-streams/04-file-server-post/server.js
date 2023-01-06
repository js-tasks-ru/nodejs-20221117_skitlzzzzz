const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  const stream = fs.createWriteStream(filepath, {flags: 'w'});
  const limit = new LimitSizeStream({limit: 1000000});

  stream.pipe(limit).pipe(stream).pipe(res).on('finish', ()=> {
    res.statusCode = 200;
    res.end('ok');
  });

  stream.on('open', () => console.log('open'));
  stream.on('end', () => console.log('end'));

  switch (req.method) {
    case 'POST':
      limit.on('error', (error) => {
        console.log(error);
        if (error.code === 'LIMIT_EXCEEDED') {
          res.statusCode = 413;
          res.end('too big file');
        } else {
          res.statusCode = 500;
          res.end('internal server error');
        }
        fs.unlink(filepath, ()=>console.log('rm file'));
      });

      stream.on('error', (error) => {
        console.log(error);
        if (error.code === 'ENOENT') {
          if (pathname.includes('/')) {
            res.statusCode = 400;
            res.end('incorrect req');
          }
        } else if (error.code === '') {
          res.statusCode = 409;
          res.end('file already exist');
        } else {
          res.statusCode = 500;
          res.end('internal server error');
        }
        fs.unlink(filepath, ()=>console.log('rm file'));
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }

  req.on('abort', () => {
    stream.destroy();
    fs.unlink(filepath, ()=>console.log('rm file'));
  });
});

module.exports = server;
