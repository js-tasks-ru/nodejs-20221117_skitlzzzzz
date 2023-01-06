const server = require('./server');
const fs = require('fs');
const path = require('path');

server.on('request', (req, res) => {
  const url = new URL(req.url, 'http://localhost:3000');
  const filename = url.searchParams.get(['filename']);

  const pathname = path.join(__dirname, './files/' + filename);

  if (req.method !== 'GET') {
    res.statusCode = 500;
    res.end('internal server error');
  }

  const stream = fs.createReadStream(pathname);
  stream.pipe(res);

  stream.on('open', () => console.log('open'));
  stream.on('end', () => console.log('end'));

  stream.on('error', (error) => {
    console.log(error);
    if (error.code === 'ENOENT') {
      if (filename.includes('/')) {
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
  });

  req.on('abort', () => {
    stream.destroy();
  });
});

server.listen(3000, () => {
  console.log('Server is listening on http://localhost:3000');
});

