const fs = require('fs-extra');
const path = require('path');
const log = require('./log');
const webpck = require('./webpck');
const { filterWebpackInfo, archive } = require('./util');
const formstream = require('formstream');
const http = require('http');

async function publish(config) {
  const info = require(path.resolve(process.cwd(), config));
  let cwdOutput = '';
  let cwdDir = '';
  let packPath = '';

  if (info.repository) {
    cwdDir = path.resolve(info.repository, info.email, 'components');
    cwdOutput = path.join(info.repository, info.email, './.temp');
    packPath = path.join(info.repository, info.email, './package.zip');
  } else {
    const configPath = path.resolve(process.cwd(), path.dirname(config))
    cwdDir = path.resolve(configPath, info.src);
    cwdOutput = path.resolve(configPath, './.temp');
    packPath = path.resolve(configPath, './package.zip');
  }

  let comps = [];
  try {
    comps = await fs.readdir(cwdDir);
  } catch (ex) {
    return log.err('目录不存在或不为文件夹');
  }

  let cfgs = [];
  for (let i = 0; i < comps.length; i++) {
    const compath = comps[i];
    const versions = await fs.readdir(path.join(cwdDir, compath));
    cfgs.push(...versions.map((ver) => ({
      entry: path.join(cwdDir, compath, ver),
      output: path.join(cwdOutput, compath, ver),
      filename: 'index.js'
    })));
  }

  cfgs = filterWebpackInfo(cfgs);

  log.info('正在编译...');

  webpck('production', cfgs, async () => {
    const compInfos = [];

    // 复制预览图
    cfgs.forEach(({ entry, output }) => {
      const dirs = fs.readdirSync(entry);
      const preview = dirs.find((name) => /\.(png|jpe?g|gif|svg)(\?.*)?$/.test(name))
      if (preview) {
        fs.copyFileSync(path.join(entry, preview), path.join(output, preview));
      } else {
        log.err(entry + 'preview.png预览图不存在');
      }
    });

    // 读取config.json
    comps.forEach((comp) => {
      try {
        const compInfo = fs.readJSONSync(path.resolve(cwdDir, comp, 'config.json'));
        const versions = fs.readdirSync(path.resolve(cwdDir, comp)).filter((name) => name !== 'config.json');
        versions.forEach((version) => {
          const dirs = fs.readdirSync(path.resolve(cwdDir, comp, version));
          const preview = dirs.find((name) => /\.(png|jpe?g|gif|svg)(\?.*)?$/.test(name))
          compInfos.push({
            name: comp,
            version,
            chineseName: compInfo.name,
            description: compInfo.description,
            type: compInfo.type,
            preview: preview || ''
          });
        });
      } catch (e) {
        log.err(e);
      }
    });


    // 复制源码
    for (let i = 0; i < cfgs.length; i++) {
      const { entry, output } = cfgs[i];
      await fs.copy(entry, path.join(output, 'src'));
    }

    // 打包
    log.info('正在打包...');
    try {
      await archive(cwdOutput, packPath);
      fs.removeSync(cwdOutput);
      log.success('打包成功');
      log.info('正在上传...');

      const form = formstream();
      form.file('file', packPath, 'package.zip');
      form.field('email', info.email);
      form.field('password', info.password);
      form.field('compInfos', JSON.stringify(compInfos));

      const req = http.request(info.server, {
        method: 'POST',
        headers: form.headers()
      }, (res) => {
        log.info(`Status: ${res.statusCode}`);
        res.on('data', function (data) {
          const result = JSON.parse(data);
          if (result.code === 1) {
            log.success(result.msg);
          }
          if (result.code === 0) {
            log.err(result.msg);
          }
        });

        res.on('error', function (e) {
          log.err(e);
        });

        res.on('close', function () {
          fs.removeSync(packPath);
        })
      });

      req.on('error', function (e) {
        log.err(e);
      });

      req.on('close', function () {
        fs.removeSync(packPath);
      });

      form.pipe(req);
    } catch (e) {
      log.err('打包失败');
      fs.removeSync(packPath);
    }
  });
}

module.exports = publish;