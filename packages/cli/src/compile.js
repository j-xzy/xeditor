const log = require('./log');
const webpck = require('./webpck');

async function compile(mode, entry, output, filename) {
  log.info('正在编译...');

  webpck(mode, [{
    entry,
    output,
    filename
  }]);
}

module.exports = compile;