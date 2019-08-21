import template from '@babel/template';
import * as t from '@babel/types';
import { ICompiler, INode } from '../../core';
import { parseExpres } from '../../util';

/**
 * const data = state['3']['data'];
 * <comp style={data}></comp>
 */
export function dataLoader(ast: t.Program | t.File, node: INode, _path: string, compiler: ICompiler) {
  const body = ast.type === 'File' ? ast.program.body : ast.body;
  const func = body.find((item) => item.type === 'FunctionDeclaration') as t.FunctionDeclaration;

  const binded = compiler.config.body.data.canvas.dataDriver[node.state.id!];
  let dataDec: t.VariableDeclaration;

  if (binded && typeof binded.data !== 'undefined') {
    const exp = parseExpres(binded.data.value, 'state');
    dataDec = t.variableDeclaration('const', [t.variableDeclarator(t.identifier('data'), exp)]);
  } else {
    dataDec = template(`const data = state[${node.state.id}]['data']`)();
  }

  func.body.body.splice(func.body.body.length - 1, 0, dataDec);

  const jsxElement = (func.body.body[func.body.body.length - 1] as t.ReturnStatement).argument as t.JSXElement;
  jsxElement.openingElement.attributes.push(
    t.jsxAttribute(t.jsxIdentifier('data'), t.jsxExpressionContainer(t.identifier('data')))
  );
  return ast;
}
