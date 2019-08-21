import * as t from '@babel/types';
import * as fs from 'fs-extra';
import * as path from 'path';
import { ICompiler, Plugin } from '../../core';
import * as util from '../../util';
import { packageTemplate } from './package';

const source: { [p: string]: string } = {
  'antd': '"antd": "3.12.4"',
  'echarts': '"echarts": "4.2.0-rc.2"',
  'lodash': '"lodash": "4.17.15"',
  'd3': '"d3": "5.7.0"',
  'jquery': '"jquery": "3.4.1"',
  'echarts-gl': '"echarts-gl": "1.1.1"',
  'ol-commonjs': '"ol-commonjs":"5.3.0"',
  'leaflet': '"leaflet":"1.4.0"',
  'flv.js': '"flv.js": "1.5.0"',
  'hls.js': '"hls.js": "0.12.4"',
  'rc-tween-one': '"rc-tween-one": "2.4.1"',
  'react-tabllist': '"react-tabllist": "*"'
};

const compatibleDeps = [
  '"core-js": "2.6.9"',
  '"regenerator-runtime": "0.13.3"',
  '"whatwg-fetch": "3.0.0"'
];

export class Dependency extends Plugin {

  private depSet: Set<string> = new Set();

  public async afterGenerate(compiler: ICompiler) {
    for (const name in compiler.compInfos) {
      const info = compiler.compInfos[name];
      const ast = util.parse(info.code);
      const importSrcs = this.getAllImport(ast).map((node) => (node as t.ImportDeclaration).source.value);
      for (let i = 0; i < importSrcs.length; i++) {
        await this.collect(importSrcs[i], info.dir);
      }
    }
    const deps = Array.from(this.depSet);
    if (compiler.config.compatible === true) {
      deps.push(...compatibleDeps);
    }
    await fs.writeFile(path.join(compiler.srcPath, '../package.json'), this.packageJson(deps));
  }

  private async collect(name: string, dir: string) {
    const pInfo = path.parse(name);
    if (pInfo.dir === '') {
      return typeof source[name] !== 'undefined' && this.depSet.add(source[name]);
    }

    let pth = path.join(dir, name);

    // 无后缀
    if (pInfo.ext === '') {
      try {
        // default导入
        const drs = await fs.readdir(path.join(dir, name));
        const withExt = drs.find((str) => /index.(js|jsx)/.test(str));
        if (!withExt) {
          return;
        }
        pth = path.join(dir, name, withExt);
      } catch (e) {
        const dirs = await fs.readdir(path.join(dir, pInfo.dir));
        const withExt = dirs.find((str) => path.parse(str).name === pInfo.name);
        if (!withExt) {
          return;
        }
        pth = path.join(dir, pInfo.dir, withExt);
      }
    }

    if (/.(js|jsx)$/.test(pth)) {
      const code = (await fs.readFile(pth)).toString();
      const file = util.parse(code);
      const importSrcs = this.getAllImport(file).map((node) => (node as t.ImportDeclaration).source.value);
      importSrcs.forEach((item) => {
        this.collect(item, path.dirname(pth));
      });
    }
  }

  private packageJson(dep: string[]) {
    let dependencies = '';

    for (let i = 0; i < dep.length; i++) {
      dependencies += dep[i] + ',\n';
    }

    dependencies = dependencies.slice(0, dependencies.lastIndexOf(','));
    return packageTemplate(dependencies);
  }

  private getAllImport(file: t.File) {
    return file.program.body.filter((node) => node.type === 'ImportDeclaration');
  }
}
