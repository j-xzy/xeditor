import * as fs from 'fs-extra';
import * as path from 'path';
import { ICompiler, Plugin } from '../../core';

function genRc(compatible: boolean) {
  return `{
  "presets": [
    [
      "@babel/env",
      {
        "targets": {
          "chrome": ${compatible ? 40 : 52},
          ${compatible ? '"ie": 11' : ''}
        }
      }
    ],
    "@babel/react"
  ],
  "plugins": [
    [
      "import",
      {
        "libraryName": "antd",
        "style": "css",
        "libraryDirectory": "es"
      }
    ],
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties", { "loose" : true }]
  ]
}`;
}

export class Babelrc extends Plugin {

  public async afterGenerate(compiler: ICompiler) {
    await fs.writeFile(path.join(compiler.srcPath, '..', '.babelrc'), genRc(compiler.config.compatible === true));
  }
}
