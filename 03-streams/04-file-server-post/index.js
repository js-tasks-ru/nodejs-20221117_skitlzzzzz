const server = require('./server');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

server.on('request', (req, res) => {
  const url = new URL(req.url, 'http://localhost:3000');
  const filename = url.searchParams.get(['filename']);

  const pathname = path.join(__dirname, './files/' + filename);

  if (req.method !== 'POST') {
    res.statusCode = 500;
    res.end('internal server error');
  }

  const stream = fs.createWriteStream(pathname, {flags: 'w'});
  const limit = new LimitSizeStream({limit: 1000000});
  stream.pipe(limit).pipe(stream).pipe(res).on('finish', ()=> {
    res.statusCode = 200;
    res.end('ok');
  });

  stream.on('open', () => console.log('open'));
  stream.on('end', () => console.log('end'));

  limit.on('error', (error) => {
    console.log(error);
    if (error.code === 'LIMIT_EXCEEDED') {
      res.statusCode = 413;
      res.end('too big file');
    } else {
      res.statusCode = 500;
      res.end('internal server error');
    }
    fs.unlink(pathname, ()=>console.log('rm file'));
  });


  stream.on('error', (error) => {
    console.log(error);
    if (error.code === 'ENOENT') {
      if (filename.includes('/')) {
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
    fs.unlink(pathname, ()=>console.log('rm file'));
  });

  req.on('abort', () => {
    stream.destroy();
    fs.unlink(pathname, ()=>console.log('rm file'));
  });
});


server.listen(3000, () => {
  console.log('Server is listening on http://localhost:3000');
});
