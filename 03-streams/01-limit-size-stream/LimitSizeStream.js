const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.limit = options.limit;
    this.encoding = options.encoding;
    this.usedBytes = 0;
  }

  _transform(chunk, encoding, callback) {
    let error = null;
    this.usedBytes += chunk.byteLength;
    console.log(this.usedBytes);
    if (this.usedBytes > this.limit) {
      error = new LimitExceededError();
    }
    callback(error, chunk);
  }
}

module.exports = LimitSizeStream;
