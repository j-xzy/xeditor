/* eslint-disable */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const base = require('./webpack.base');
const path = require('path');

module.exports = function (config) {
  return merge(base(config), {
    devtool: 'cheap-module-source-map',
    mode: 'development',
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(config.entry, '..', 'index.html')
      })
    ]
  })
} 
