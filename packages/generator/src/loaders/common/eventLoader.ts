import template from '@babel/template';
import * as t from '@babel/types';
import { ICompiler, INode } from '../../core';
import { generateEvt } from '../../generateEvt';

const build = template(`
const trigger = React.useCallback((type, data) => {
  BODY
});
`);

/**
 * 事件loader
 * @param name 名称
 * @param compPath 其依赖的component路径
 * @param compiler 相关信息
 */
export function eventLoader(ast: t.File, node: INode, _compPath: string | ICompiler, _compiler?: ICompiler) {
  let compiler: ICompiler;
  if (arguments.length === 4) {
    compiler = _compiler as ICompiler;
  } else {
    compiler = _compPath as ICompiler;
  }

  const evtState = compiler.config.body.data.canvas.eventState;
  const evts = evtState.children.filter((item) =>
    (item.state as Editor.PluginEvent.IEventNodeState).sourceId === node.state.id
    && (item.state as Editor.PluginEvent.IEventNodeState).disabled === false
  );

  // 1. <div trigger={trigger}></div>
  const func = ast.program.body.find((item) => item.type === 'FunctionDeclaration') as t.FunctionDeclaration;
  const jsxElement = (func.body.body[func.body.body.length - 1] as t.ReturnStatement).argument as t.JSXElement;

  if (!node.option.box && evts.length === 0) {
    // 不是容器组件<div>,且无事件绑定
    // <div trigger={()=>{}}></div>
    jsxElement.openingElement.attributes.push(
      t.jsxAttribute(
        t.jsxIdentifier('trigger'),
        t.jsxExpressionContainer(t.arrowFunctionExpression([], t.blockStatement([])))
      ));
    return ast;
  }

  if (node.option.box) {
    // 是容器组件
    jsxElement.openingElement.attributes.push(
      t.jsxAttribute(
        t.jsxIdentifier('onClick'),
        t.jsxExpressionContainer(t.arrowFunctionExpression([], t.callExpression(t.identifier('trigger'), [t.stringLiteral('click')])))
      ),
      t.jsxAttribute(
        t.jsxIdentifier('onMouseEnter'),
        t.jsxExpressionContainer(t.arrowFunctionExpression([], t.callExpression(t.identifier('trigger'), [t.stringLiteral('onMouseEnter')])))
      ),
      t.jsxAttribute(
        t.jsxIdentifier('onMouseOut'),
        t.jsxExpressionContainer(t.arrowFunctionExpression([], t.callExpression(t.identifier('trigger'), [t.stringLiteral('onMouseOut')])))
      ),
      t.jsxAttribute(
        t.jsxIdentifier('onMouseOver'),
        t.jsxExpressionContainer(t.arrowFunctionExpression([], t.callExpression(t.identifier('trigger'), [t.stringLiteral('onMouseOver')])))
      ),
      t.jsxAttribute(
        t.jsxIdentifier('onMouseMove'),
        t.jsxExpressionContainer(t.arrowFunctionExpression([], t.callExpression(t.identifier('trigger'), [t.stringLiteral('onMouseMove')])))
      )
    );
  } else {
    jsxElement.openingElement.attributes.push(
      t.jsxAttribute(t.jsxIdentifier('trigger'), t.jsxExpressionContainer(t.identifier('trigger')))
    );
  }

  // 2.
  const BODY = evts.map((eNode) => generateEvt(eNode, 'state'));
  const evtAst = build({
    BODY
  });
  func.body.body.splice(func.body.body.length - 1, 0, evtAst);

  return ast;
}
