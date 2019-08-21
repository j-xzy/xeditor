const webpack = require('webpack');
const devWebPack = require('./webpack.dev');
const prodWebpack = require('./webpack.prod');

process.on('message', (message) => {
  const { config } = message;
  pack(config, {
    onError() {
      process.send({ error: true });
      process.disconnect();
    },
    onSuccess() {
      process.send({ error: false });
      process.disconnect();
    }
  })
});

function pack(config, callback) {
  let webPack = devWebPack;
  if (config.mode === 'production') {
    webPack = prodWebpack;
  }

  webpack(webPack(config)).run((err, stats) => {
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
      return callback.onError && callback.onError(err);
    }

    const info = stats.toJson();

    if (stats.hasErrors()) {
      console.error(info.errors);
    }
    callback.onSuccess && callback.onSuccess();
  });
}
