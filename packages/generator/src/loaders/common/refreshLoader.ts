import * as parser from '@babel/parser';
import * as t from '@babel/types';
import { ICompiler, INode } from '../../core';
import { parseExpres } from '../../util';

/**
 * import useRefresh from '@/hooks/refresh';
 * const key = useRefresh(time);
 */
export function refreshLoader(ast: t.Program | t.File, node: INode | Editor.ICanvaStoreState, _path: string, compiler: ICompiler) {
  const state = isCanvaStoreState(node) ? node : node.state;

  const dataDriver = compiler.config.body.data.canvas.dataDriver[state.id!];
  let exp!: t.NumberLiteral | t.Expression;

  if (dataDriver && dataDriver['property.refresh']) {
    exp = parseExpres(dataDriver['property.refresh'].value, 'state');
  }

  if (typeof exp === 'undefined') {
    if (state.property && typeof state.property.refresh !== 'undefined' && state.property.refresh !== '') {
      const time = parseInt(state.property.refresh, 10);
      if (!isNaN(time) && time > 0) {
        exp = t.identifier(time.toString());
      }
    }
  }

  if (typeof exp === 'undefined') {
    return ast;
  }

  const hookPath = isCanvaStoreState(node) ? './hooks/useRefresh' : '../hooks/useRefresh';
  const importStatment = parser.parse(`import useRefresh from '${hookPath}'`, { sourceType: 'module' }).program.body[0];
  const body = ast.type === 'File' ? ast.program.body : ast.body;
  body.unshift(importStatment);

  const func = body.find((item) => item.type === 'FunctionDeclaration') as t.FunctionDeclaration;
  const dec = t.variableDeclaration('let', [t.variableDeclarator(t.identifier('key'), t.callExpression(t.identifier('useRefresh'), [exp]))]);
  func.body.body.splice(func.body.body.length - 1, 0, dec);

  const jsxElement = (func.body.body[func.body.body.length - 1] as t.ReturnStatement).argument as t.JSXElement;
  jsxElement.openingElement.attributes.push(
    t.jsxAttribute(t.jsxIdentifier('key'), t.jsxExpressionContainer(t.identifier('key')))
  );
  return ast;
}

function isCanvaStoreState(state: INode | Editor.ICanvaStoreState): state is Editor.ICanvaStoreState {
  if ((state as INode).children && (state as INode).state && (state as INode).option && (state as INode).state) {
    return false;
  }
  return true;
}
