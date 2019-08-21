/**
 *   var opt = {}
 *   export default {       export default {
 *    reducer: reducer,       reducer: reducer,
 *    component: Comp,   =>   component: Comp
 *    option: opt           };
 *   };
 */

import * as t from '@babel/types';

export function exportLoader(ast: t.File | t.Program) {
  const program = ast.type === 'File' ? ast.program : ast;
  const exportNode = program.body.find((node) => node.type === 'ExportDefaultDeclaration') as t.ExportDefaultDeclaration;
  const properties = (exportNode.declaration as t.ObjectExpression).properties as t.ObjectProperty[];
  for (let i = properties.length - 1; i >= 0; i--) {
    const objProp = properties[i] as t.ObjectProperty;
    if ((objProp.key as t.Identifier).name === 'option') {
      if (objProp.value.type === 'Identifier') {
        removeOpt((objProp.value as t.Identifier).name, program);
      }
      properties.splice(i, 1);
      break;
    }
  }
  return ast;
}

function removeOpt(name: string, program: t.Program) {
  for (let i = 0; i < program.body.length; i++) {
    if (program.body[i].type === 'VariableDeclaration') {
      const declarations = (program.body[i] as t.VariableDeclaration).declarations;
      for (let n = 0; n < declarations.length; n++) {
        if ((declarations[n].id as t.Identifier).name === name) {
          declarations.splice(n, 1);
          break;
        }
      }
      if (declarations.length === 0) {
        program.body.splice(i, 1);
        break;
      }
    }
  }
}
