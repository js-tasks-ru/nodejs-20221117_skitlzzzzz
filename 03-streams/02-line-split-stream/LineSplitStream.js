const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.encoding = options.encoding;
    this.EOL = os.EOL;
  }

  _transform(chunk, encoding, callback) {
    callback(null, chunk);
  }

  _flush(callback) {

  }
}

module.exports = LineSplitStream;

const zzz = new LineSplitStream({encoding: 'utf-8'});
zzz.on('data', ((chunk) => {
  console.log(chunk);
}) );
zzz.write('fffffff');
