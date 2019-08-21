const path = require('path');

module.exports = {
  email: 'example@hiynn.com', // 简绘账号
  password: 'password', // 简绘密码
  server: 'http://localhost:7001/comp', // 组件上传服务地址
  repository: '/home/whj/Documents/xeditor/vendor', // vendor地址
  mode: 'production', // production, development
  compatible: false, // 兼容低版本浏览器
  app: path.resolve(__dirname, '../public', 'studio'), // 前端代码
  dist: path.resolve(__dirname, '../public', 'dist'), //　编译后的项目目录
  pack: path.resolve(__dirname, '../pack', 'index.js'),　// webpack打包脚本路径
  port: 8000, // 端口
  project: path.resolve(__dirname, '../public', 'projects'),　// 生成的项目源路径
  public: path.resolve(__dirname, '../public'), // pulic资源路径
};