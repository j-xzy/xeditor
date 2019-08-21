import template from '@babel/template';
import * as t from '@babel/types';
import { ICompiler, INode } from '../../core';
import { parseExpres, toObjectExpression } from '../../util';

/**
 * const style = update(state['3']['property'] {xxx: state['24']['data'] }};
 * <comp property={property}></comp>
 */
export function propertyLoader(ast: t.Program | t.File, node: INode, _path: string, compiler: ICompiler) {
  const body = ast.type === 'File' ? ast.program.body : ast.body;
  const func = body.find((item) => item.type === 'FunctionDeclaration') as t.FunctionDeclaration;

  const dataDec = template(`const property = update(state[${node.state.id}]['property'], {})`)();
  const binded = compiler.config.body.data.canvas.dataDriver[node.state.id!];

  if (binded) {
    const props = Object.keys(binded).filter((p) => p.indexOf('property.') === 0);
    if (props.length > 0) {
      const updateObjExpre = toObjectExpression(props.map((property) => ({
        value: parseExpres(binded[property].value, 'state'),
        property: property.slice(property.indexOf('.') + 1) + '.$set'
      })));
      (dataDec.declarations[0].init as t.CallExpression).arguments[1] = updateObjExpre;
    }
  }

  func.body.body.splice(func.body.body.length - 1, 0, dataDec);

  const jsxElement = (func.body.body[func.body.body.length - 1] as t.ReturnStatement).argument as t.JSXElement;
  jsxElement.openingElement.attributes.push(
    t.jsxAttribute(t.jsxIdentifier('property'), t.jsxExpressionContainer(t.identifier('property')))
  );
  return ast;
}
