import generate from '@babel/generator';
import * as parser from '@babel/parser';
import * as t from '@babel/types';

/**
 * import { useStore } from '../../packages/annie';
 * const { state, emit } = useStore();
 */
export function useStoreLoader(ast: t.Program | t.File) {
  const code = generate(ast).code;
  const deps = Array.from(new Set(code.match(/(?<=state\[)[0-9]*(?=\])/g)));
  const depStr = `[${deps.map((i) => i).join(',')}]`;

  const importStatment = parser.parse('import { useStore } from \'../../packages/annie\'', { sourceType: 'module' }).program.body[0];
  const body = ast.type === 'File' ? ast.program.body : ast.body;
  body.unshift(importStatment);

  const func = body.find((item) => item.type === 'FunctionDeclaration') as t.FunctionDeclaration;
  const useStatment = parser.parse(`const { state, emit } = useStore(${depStr});`).program.body[0];
  func.body.body.unshift(useStatment);
  return ast;
}
