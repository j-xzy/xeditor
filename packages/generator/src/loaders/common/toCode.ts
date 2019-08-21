import generate from '@babel/generator';

export function toCodeLoader(ast: any) {
  if (typeof ast === 'string') {
    return ast;
  }
  return generate(ast).code;
}
