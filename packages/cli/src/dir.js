const fs = require('fs-extra');
const debounce = require('lodash.debounce');
const path = require('path');
const compile = require('./compile');
const chokidar = require('chokidar');
const log = require('./log');
const webpck = require('./webpck');
const filter = require('./util').filterWebpackInfo;

async function dir(directory, output, opts) {
  const watch = opts.watch || false;

  let mode = opts.mode || 'development';
  let cwdDir = typeof directory !== 'undefined' && path.join(process.cwd(), directory);
  let cwdOutput = typeof output !== 'undefined' && path.join(process.cwd(), output);

  if (typeof opts.config !== 'undefined') {
    const info = require(path.resolve(process.cwd(), opts.config));
    const configPath = path.resolve(process.cwd(), path.dirname(opts.config))
    mode = info.mode || 'development';
    if (info.repository) {
      cwdDir = path.resolve(info.repository, info.email, 'components');
      cwdOutput = path.resolve(info.repository, info.email, 'dist');
    } else {
      cwdDir = path.resolve(configPath, info.src);
      cwdOutput = path.resolve(configPath, info.dist);
    }
  }

  let comps = [];
  try {
    comps = await fs.readdir(cwdDir);
  } catch (ex) {
    return log.err('目录不存在或不为文件夹');
  }

  const cfgs = [];
  for (let i = 0; i < comps.length; i++) {
    const compath = comps[i];
    const pth = path.join(cwdDir, compath);
    let versions = [];
    try {
      versions = await fs.readdir(pth);
    } catch(e) {
      //
    } 
    cfgs.push(...versions.map((ver) => ({
      entry: path.join(pth, ver),
      output: path.join(cwdOutput, compath, ver),
      filename: 'index.js'
    })));
  }

  log.info('正在编译...');

  const debounceComplie = debounce((mode, compath, outPath) => {
    compile(mode, compath, outPath, 'index.js');
  }, 1000);

  webpck(mode, filter(cfgs), () => {
    if (watch) {
      chokidar.watch(cwdDir, { ignoreInitial: true }).on('all', (t, p) => {
        const splitArr = p.slice(cwdDir.length).split(/\/|\\/);
        let folderCount = splitArr[0] === '' ? splitArr.length - 1 : splitArr.length;
        let name = splitArr[0];
        let ver = splitArr[1];
        if (splitArr[0] === '') {
          name = splitArr[1];
          ver = splitArr[2];
        }
        if (t === 'unlinkDir' || t === 'unlink') {
          if (folderCount === 2) {
            fs.removeSync(path.join(cwdOutput, name, ver));
          }
          if (folderCount === 1) {
            fs.removeSync(path.join(cwdOutput, name));
          }
          return;
        }
        if (folderCount > 2) {
          const compath = path.join(cwdDir, name, ver);
          const outPath = path.join(cwdOutput, name, ver);
          debounceComplie(mode, compath, outPath);
        }
      });
      log.info('正在监听...');
    }
  });
}

module.exports = dir;