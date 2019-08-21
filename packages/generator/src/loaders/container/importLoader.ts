import * as t from '@babel/types';
import { INode } from '../../core';
import * as util from '../../util';

/**
 * import CompReducer from "../components/xxx-xxx-v1.0";
 * @param name 名称
 * @param compPath 其依赖的component路径
 */
export function conainerImportLoader(ast: t.File, _node: INode, compPath: string) {
  const importDeclaration = util.makeDefaultImport('CompReducer', compPath);
  ast.program.body.unshift(importDeclaration);
  return ast;
}
