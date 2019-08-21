const path = require('path');
const rootPath = path.join(__dirname, '../../');
const srcPath = path.join(rootPath, 'src');

module.exports = {
  root: rootPath, // 根目录
  src: srcPath, // 前端源码目录
  entry: path.join(srcPath, 'index.js'), // 前端入口
  template: path.join(srcPath, 'index.html'), // 前端模板入口
  dist: rootPath + '/dist', // 前端编译后的目录
  publicPath: './', // webpack public配置(静态资源目录)
  port: 3001, // 开发模式下前端服务端口号
}
