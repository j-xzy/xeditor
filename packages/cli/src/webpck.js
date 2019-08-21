const webpack = require('webpack');
const path = require('path');
const externals = require('./externals');
const log = require('./log');
const fs = require('fs-extra');
const os = require('os');

function compile(mode, infos, callback) {
  const config = infos.map(({ entry, output, filename }) => {
    return template(mode, entry, output, filename);
  });

  // 开始打包
  webpack(config).run((err, stats) => {
    if (err) {
      log.err(err.stack || err);
      if (err.details) {
        log.err(err.details);
      }
      return;
    }

    const info = stats.toJson();

    if (stats.hasErrors()) {
      return log.err(info.errors);
    }

    if (stats.hasWarnings()) {
      log.warn(info.warnings);
    }

    log.success('编译成功')
    callback && callback();
  });
}

const basePresets = [
  [
    require("@babel/preset-env"),
    {
      "targets": {
        "chrome": 52
      }
    }
  ],
  require("@babel/preset-react"),
];

// webpack配置模板
function template(mode, entry, output, filename) {
  let idx = entry;
  if (path.extname(idx) !== '.jsx' && path.extname(idx) !== '.js') {
    let p = `${path.join(idx, 'index.js')}|${path.join(idx, 'index.jsx')}`;
    const osType = os.type().toLowerCase();
    if (osType.includes('win')) {
      p = p.replace(/\\/g, '\\\\')
    }
    idx = new RegExp(p)
  }
  return {
    entry: entry,
    mode,
    context: __dirname,
    output: { filename, path: output, libraryTarget: 'amd' },
    devtool: mode === 'production' ? 'none' : 'inline-source-map',
    externals,
    resolve: {
      extensions: ['.js', '.jsx', '.json']
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: basePresets,
              plugins: [
                [require('@xeditor/babel-plugin-editor'), { connect: false }],
                [require('@babel/plugin-proposal-decorators'), { "legacy": true }],
                [require('@babel/plugin-proposal-class-properties'), { "loose": true }]
              ]
            }
          }
        },
        {
          test: idx,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: basePresets,
              plugins: [
                [require('@xeditor/babel-plugin-editor'), { connect: true }],
                [require('@babel/plugin-proposal-decorators'), { "legacy": true }],
                [require('@babel/plugin-proposal-class-properties'), { "loose": true }]
              ]
            }
          }
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader',
          ]
        },
        {
          test: /\.scss$/,
          use: [
            "style-loader",
            "css-loader",
            "sass-loader"
          ]
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'url-loader'
        }, {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
        }, {
          test: /\.(avi|mp4|mov|asf|wmv|navi|3gp|mkv|flv|f4v|rmvb|webm|qsv|ogg)(\?.*)?$/i,
          loader: 'url-loader'
        }
      ]
    }
  }
}

module.exports = compile;