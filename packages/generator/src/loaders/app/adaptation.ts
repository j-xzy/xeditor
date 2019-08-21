import * as parser from '@babel/parser';
import * as t from '@babel/types';

/**
 * import useAdaptation from './hooks/useAdaptation';
 * useAdaptation();
 */
export function adaptationLoader(ast: t.File | t.Program, state: Editor.ICanvaStoreState) {
  if (!state.property || !state.property.adaptation) {
    return ast;
  }

  const importStatment = parser.parse('import useAdaptation from \'./hooks/useAdaptation\'', { sourceType: 'module' }).program.body[0];
  const body = ast.type === 'File' ? ast.program.body : ast.body;
  body.unshift(importStatment);

  const func = body.find((item) => item.type === 'FunctionDeclaration') as t.FunctionDeclaration;
  const dec = t.expressionStatement(t.callExpression(t.identifier('useAdaptation'), []));
  func.body.body.splice(func.body.body.length - 1, 0, dec);
  return ast;
}
