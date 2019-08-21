import template from '@babel/template';
import * as t from '@babel/types';
import { ICompiler, INode } from '../../core';
import { parseExpres, toObjectExpression } from '../../util';

/**
 * const style = update(state['3']['style'] {xxx: state['24']['data'] }};
 * <comp style={style}></comp>
 */
export function styleLoader(ast: t.Program | t.File, node: INode | Editor.ICanvaStoreState, _path: ICompiler | string, _compiler?: ICompiler | string) {
  let compiler!: ICompiler;
  if (arguments.length === 3) {
    compiler = _path as ICompiler;
  }
  if (arguments.length === 4) {
    compiler = _compiler as ICompiler;
  }

  const body = ast.type === 'File' ? ast.program.body : ast.body;
  const func = body.find((item) => item.type === 'FunctionDeclaration') as t.FunctionDeclaration;
  const id = isCanvasStoreState(node) ? node.id : node.state.id;

  const styleDec = template(`const style = update(state[${id}]['style'], {})`)();

  const binded = compiler.config.body.data.canvas.dataDriver[id!];

  if (binded) {
    const props = Object.keys(binded).filter((p) => p.indexOf('style.') === 0);
    if (props.length > 0) {
      const updateObjExpre = toObjectExpression(props.map((property) => ({
        value: parseExpres(binded[property].value, 'state'),
        property: property.slice(property.indexOf('.') + 1) + '.$set'
      })));
      (styleDec.declarations[0].init as t.CallExpression).arguments[1] = updateObjExpre;
    }
  }

  func.body.body.splice(func.body.body.length - 1, 0, styleDec);

  const jsxElement = (func.body.body[func.body.body.length - 1] as t.ReturnStatement).argument as t.JSXElement;
  jsxElement.openingElement.attributes.push(
    t.jsxAttribute(t.jsxIdentifier('style'), t.jsxExpressionContainer(t.identifier('style')))
  );
  return ast;
}

function isCanvasStoreState(node: INode | Editor.ICanvaStoreState): node is Editor.ICanvaStoreState {
  return typeof (node as Editor.ICanvaStoreState).id !== 'undefined';
}
