import * as parser from '@babel/parser';

export function toAstLoader(src: any) {
  if (typeof src !== 'string') {
    return src;
  }
  const ast = parser.parse(src, {
    sourceType: 'module',
    plugins: [
      'jsx',
      'objectRestSpread',
      'classProperties',
      'asyncGenerators',
      ['decorators', {
        decoratorsBeforeExport: true
      }] as any
    ]
  });
  return ast;
}
