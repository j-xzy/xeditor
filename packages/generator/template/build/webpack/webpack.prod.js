const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const base = require('./webpack.base');
const config = require('../config');

module.exports = merge(base, {
  mode: 'production',
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    runtimeChunk: true
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: config.root
    }),
    new HtmlWebpackPlugin({
      template: config.template,
      inject: true,
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
