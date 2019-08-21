# SDK

组件本地开发环境

# 快速开始


## 开启服务

1. 更名config-example.js

```
config-example.js => config.js
```

2. 安装依赖

根目录下

```
npm install
```

pack目录下

```
npm install
```

3. 启动服务

根目录下

```
npm run server
```

端口默认8000

## 开发组件

1. 克隆[组件项目仓库](http://192.168.5.11:10080/editor/vendor)到本地

```
git clone ssh://git@192.168.5.11:10022/editor/vendor.git

or

git clone http://192.168.5.11:10080/editor/vendor.git
```

2. 创建组件文件夹

在仓库中创建以公司邮箱为名的文件夹,具体格式请严格参照 *example＠hiynn.com*

3. 配置SDK中的config.js

``` js
const path = require('path');

module.exports = {
  email: 'example@hiynn.com', // 简绘账号
  password: 'password', // 简绘密码
  server: 'http://localhost:7001/comp', // 组件上传服务地址
  repository: '/home/whj/Documents/xeditor/vendor', // vendor地址
  mode: 'production', // production, development
  app: path.resolve(__dirname, '../public', 'app'), // 前端代码
  dist: path.resolve(__dirname, '../public', 'dist'), //　编译后的项目目录
  pack: path.resolve(__dirname, '../pack', 'index.js'),　// webpack打包脚本路径
  port: 8000, // 端口
  project: path.resolve(__dirname, '../public', 'projects'),　// 生成的项目源路径
  public: path.resolve(__dirname, '../public'), // pulic资源路径
};
```

以上,开发基础环境已经搭好.

4. 自动监听并编译组件

在sdk根目录下

```
npm run watch
```

5. 发布到组件市场

```
npm run publish
```

## 打开项目

- 打开本地项目

url中输入id=项目的名称

例如

http://localhost:8000/id=xxxx

- 打开vendor中的项目

url中输入id=@项目的名称

http://localhost:8000/id=@xxxx

## 支持库

- react: 16.8.6

- react-dom: 16.8.6

- antd: 3.12.4

- echarts: 4.2.0-rc.2

- lodash: 4.17.11

- d3: 5.7.0

- jquery: 3.3.1

- echarts-gl: 1.1.1

- immutability-helper:　3.0.0

- ol-commonjs:　5.3.0

- leaflet:1.4.0

- flv.js: 1.5.0
  
- hls.js: 0.12.4