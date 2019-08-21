const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const base = require('./webpack.base');
const path = require('path');

module.exports = function (config) {
  return merge(base(config), {
    mode: 'production',
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
      runtimeChunk: true
    },
    plugins: [
      new HtmlWebpackPlugin({
        inject: true,
        template: path.resolve(config.entry, '..', 'index.html'),
        minify: {
          removeComments: true,
          collapseInlineTagWhitespace: true,
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true
        }
      })
    ]
  })
}