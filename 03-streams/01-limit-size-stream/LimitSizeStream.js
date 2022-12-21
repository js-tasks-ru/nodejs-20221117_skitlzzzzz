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
    this.usedBytes += chunk.length;
    console.log(this.usedBytes);
    if (this.usedBytes >= this.limit) {
      throw new LimitExceededError;
    }
    callback(null, chunk);
  }
}

module.exports = LimitSizeStream;
