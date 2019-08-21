import * as t from '@babel/types';
import { parseExpres } from './util';

export function generateEvt(node: Editor.PluginEvent.IEventState, identifier: string) {
  const childStatements: any = node.children
    .map((cNode) => generateEvt(cNode, identifier))
    .filter((v) => typeof v !== 'undefined');

  if (node.state.disabled) {
    return;
  }

  if (node.type === 'Event') {
    return makeEvent(node.state as Editor.PluginEvent.IEventNodeState, childStatements, identifier);
  }

  if (node.type === 'Action') {
    return makeAction(node.state as Editor.PluginEvent.IActionNodeState, identifier);
  }

  if (node.type === 'Condition') {
    return makeCondition(node.state as Editor.PluginEvent.IConditionNodeState, childStatements, identifier);
  }

  if (node.type === 'ForLoop') {
    return makeForLoop(node.state as Editor.PluginEvent.IForLoopNodeState, childStatements, identifier);
  }

  if (node.type === 'Time') {
    return makeTime(node.state as Editor.PluginEvent.ITimeState, childStatements, identifier);
  }

  if (node.type === 'WhileLoop') {
    return makeWhileLoop(node.state as Editor.PluginEvent.IWhileLoopNodeState, childStatements, identifier);
  }
}

function makeEvent(state: Editor.PluginEvent.IEventNodeState, statements: t.Statement[], identifier: string) {
  const conditions: Editor.PluginEvent.IConditionNodeState[] = [{
    id: -1,
    disabled: false,
    logic: '&&',
    operator: '===',
    leftExps: [{ id: -1, disabled: false, value: 'type' }],
    rightExps: [{ id: -1, disabled: false, value: `"${state.trigger}"` }]
  }, ...state.conditions];

  return t.ifStatement(makeTestExpression(conditions, identifier), t.blockStatement(statements));
}

function makeTime(state: Editor.PluginEvent.ITimeState, statements: t.Statement[], identifier: string) {
  const exp = parseExpres(state.time.map(({ value }) => value), identifier);
  const timeType = state.timeType === 'Interval' ? 'setInterval' : 'setTimeout';
  return t.expressionStatement(
    t.callExpression(
      t.memberExpression(t.identifier('window'), t.identifier(timeType)), [
        t.arrowFunctionExpression([], t.blockStatement(statements)),
        exp
      ])
  );
}

function makeTestExpression(conds: Editor.PluginEvent.IConditionNodeState[], identifier: string) {
  let test!: t.BinaryExpression | t.LogicalExpression;
  conds.forEach((cond, idx) => {
    if (cond.disabled) {
      return;
    }
    const leftExp = parseExpres(cond.leftExps.map(({ value }) => value), identifier);
    const rightExp = parseExpres(cond.rightExps.map(({ value }) => value), identifier);
    const binaryExpre = t.binaryExpression(cond.operator, leftExp, rightExp);
    if (idx === 0) {
      return test = binaryExpre;
    }
    test = t.logicalExpression(cond.logic, test, binaryExpre);
  });
  return test;
}

function makeCondition(state: Editor.PluginEvent.IConditionNodeState, statements: t.Statement[], identifier: string) {
  return t.ifStatement(
    t.binaryExpression(
      state.operator,
      parseExpres(state.leftExps.map(({ value }) => value), identifier),
      parseExpres(state.rightExps.map(({ value }) => value), identifier)
    ),
    t.blockStatement(statements));
}

function makeAction(state: Editor.PluginEvent.IActionNodeState, identifier: string) {
  let dataExpre: t.Expression;
  if (!isPropertyExpressionState(state.data)) {
    dataExpre = (state.data.length === 1 && state.data[0].value === '')
      ? t.identifier('data') : parseExpres(state.data.map(({ value }) => value), identifier);
  } else {
    dataExpre = propertyExpToObjectExpression(state.data, identifier);
  }
  return t.expressionStatement(
    t.callExpression(
      t.identifier('emit'),
      [
        t.numericLiteral(state.targetId),
        t.stringLiteral(state.type),
        dataExpre!
      ]
    )
  );
}

function makeForLoop(state: Editor.PluginEvent.IForLoopNodeState, statements: t.Statement[], identifier: string) {
  return t.forStatement(
    t.variableDeclaration('let', [t.variableDeclarator(t.identifier('i'), t.numericLiteral(0))]),
    t.binaryExpression('<',
      t.identifier('i'),
      parseExpres(state.countExps.map(({ value }) => value), identifier)
    ),
    t.updateExpression('++', t.identifier('i')),
    t.blockStatement(statements)
  );
}

function makeWhileLoop(state: Editor.PluginEvent.IWhileLoopNodeState, statements: t.Statement[], identifier: string) {
  return t.whileStatement(makeTestExpression(state.conditions, identifier), t.blockStatement(statements));
}

function isPropertyExpressionState(params: Editor.PluginEvent.IPropertyExpressionState[] | Editor.PluginEvent.IExpressionNodeState[]): params is Editor.PluginEvent.IPropertyExpressionState[] {
  return typeof (params[0] as Editor.PluginEvent.IPropertyExpressionState).property !== 'undefined';
}

function propertyExpToObjectExpression(state: Editor.PluginEvent.IPropertyExpressionState[], identifier: string) {
  return t.objectExpression(state.map(({ property, data }) =>
    t.objectProperty(t.identifier(property), parseExpres(data.map(({ value }) => value), identifier))
  ));
}
