#!/usr/bin/env node
const program = require('commander');
const fs = require('fs-extra');
const path = require('path');
const publish = require('./publish');
const pckJson = JSON.parse(fs.readFileSync('./package.json'));
const compile = require('./compile');
const dir = require('./dir');

program.version(pckJson.version);

program
  .command('compile <compPath> <dist>')
  .usage('<单组件路径>　<输出路径>　[option]')
  .description('编译组件')
  .option("-m, --mode [mode]", "production或development")
  .action((compPath, output, opts) => {
    const mode = opts.mode || 'production';
    const outInfo = path.parse(path.join(process.cwd(), output));
    compile(mode, path.join(process.cwd(), compPath), outInfo.dir, outInfo.base);
  })
  .on('--help', () => {
    console.log('');
    console.log('例子:');
    console.log('');
    console.log('$ compile ./index.jsx -m development');
  });

program
  .command('dir <directory> <output>')
  .usage('<组件目录>　<输出路径>')
  .description('编译目录下所有组件')
  .action((directory, output) => {
    dir(directory, output, {});
  })
  .on('--help', () => {
    console.log('');
    console.log('目录结构:');
    console.log('');
    console.log('|-components/');
    console.log('  |-Button/');
    console.log('    |-v1.0/');
    console.log('      |-index.js');
    console.log('');
    console.log('例子:');
    console.log('');
    console.log('  $ dir ./components ./dist');
  });

program
  .command('watch <config>')
  .usage('<配置文件路径>')
  .description('根据配置文件编译并监听')
  .action((config) => {
    dir(undefined, undefined, { config, watch: true });
  })
  .on('--help', () => {
    console.log('例子:');
    console.log('');
    console.log('  $ watch ./config.js');
  });

program
  .command('publish [config]')
  .usage('[配置文件路径]')
  .description('提交')
  .action((config) => {
    config = config || path.resolve(process.cwd(), './config.js');
    publish(config);
  })
  .on('--help', () => {
    console.log('例子:');
    console.log('');
    console.log('  $ publish ./config.js');
  });

program.parse(process.argv);
