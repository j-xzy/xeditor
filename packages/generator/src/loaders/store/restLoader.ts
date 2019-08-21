import template from '@babel/template';
import * as t from '@babel/types';
import { INode } from '../../core';

/**
 * const {data, property, style, ...rest} = state['3'];
 * <comp property={property}></comp>
 */
export function restLoader(ast: t.Program | t.File, node: INode) {
  const body = ast.type === 'File' ? ast.program.body : ast.body;
  const func = body.find((item) => item.type === 'FunctionDeclaration') as t.FunctionDeclaration;

  const dec = template(`const {data: _data, property: _property, style: _style, ...rest}  = {...state[${node.state.id}]}`)();

  func.body.body.splice(func.body.body.length - 1, 0, dec);

  const jsxElement = (func.body.body[func.body.body.length - 1] as t.ReturnStatement).argument as t.JSXElement;
  jsxElement.openingElement.attributes.push(
    t.jsxSpreadAttribute(t.identifier('rest'))
  );
  return ast;
}
