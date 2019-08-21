/**
 *   var initialState = {}
 *   function reducer(action, state = initialState ) { }
 *   =>
 *   function reducer(action, state) {}
 */

import * as t from '@babel/types';

export function reducerLoader(ast: t.File | t.Program) {
  const program = ast.type === 'File' ? ast.program : ast;
  const exportNode = program.body.find((node) => node.type === 'ExportDefaultDeclaration') as t.ExportDefaultDeclaration;
  const properties = (exportNode.declaration as t.ObjectExpression).properties as t.ObjectProperty[];
  const reducerProp = properties.find((prop) => prop.key.type === 'Identifier' && prop.key.name === 'reducer');
  if (!reducerProp) {
    return ast;
  }
  if (reducerProp.value.type === 'Identifier') {
    const name = reducerProp.value.name;
    const func = program.body.find((node) => node.type === 'FunctionDeclaration' && node.id!.name === name);

    if (!func) {
      return ast;
    }
    removeFuncInitialState(program, func as t.FunctionDeclaration);
  }

  if (reducerProp.value.type === 'ArrowFunctionExpression' || reducerProp.value.type === 'FunctionExpression') {
    removeFuncInitialState(program, reducerProp.value);
  }
  return ast;
}

function removeFuncInitialState(program: t.Program, func: t.FunctionExpression | t.ArrowFunctionExpression | t.FunctionDeclaration) {
  const param = func.params[1];
  if (param.type !== 'AssignmentPattern') {
    return;
  }

  func.params[1] = t.identifier((param.left as t.Identifier).name);

  if (param.right.type !== 'Identifier') {
    return;
  }

  const stateName = param.right.name;
  const idx = program.body.findIndex(
    (node) => node.type === 'VariableDeclaration' &&
      (node.declarations[0].id as t.Identifier).name === stateName
  );
  program.body.splice(idx, 1);
}
