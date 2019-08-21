import * as parser from '@babel/parser';
import * as t from '@babel/types';
import * as fs from 'fs-extra';
import * as path from 'path';
import { IBody, INode, IVisitor } from './core/type';

/**
 * 遍历
 * @param root 节点
 * @param visitor 访问器
 */
export async function traverserAsync(root: INode, visitor: IVisitor) {

  async function traverse(node: INode, parent: INode | null) {

    let methods;

    if (node.option.path) {
      methods = visitor.com;
    }

    if (parent === null) {
      methods = visitor.root;
    }

    if (node.option.box) {
      methods = visitor.box;
    }

    if (!methods && visitor.default) {
      methods = visitor.default;
    }

    if (methods && methods.enter) {
      await methods.enter(node, parent);
    }

    for (let i = 0; i < node.children.length; i++) {
      await traverse(node.children[i], node);
    }

    if (methods && methods.exit) {
      await methods.exit(node, parent);
    }
  }

  await traverse(root, null);
}

/**
 * 遍历
 * @param root 节点
 * @param visitor 访问器
 */
export function traverser(root: INode, visitor: IVisitor) {

  function traverse(node: INode, parent: INode | null) {

    let methods;

    if (node.option.path) {
      methods = visitor.com;
    }

    if (parent === null) {
      methods = visitor.root;
    }

    if (node.option.box) {
      methods = visitor.box;
    }

    if (!methods && visitor.default) {
      methods = visitor.default;
    }

    if (methods && methods.enter) {
      methods.enter(node, parent);
    }

    for (let i = 0; i < node.children.length; i++) {
      traverse(node.children[i], node);
    }

    if (methods && methods.exit) {
      methods.exit(node, parent);
    }
  }

  traverse(root, null);
}

/**
 * 大写字符串首字母
 * @param str
 */
export function firstWordUpper(str: string) {
  const newStr = str[0].toUpperCase() + str.slice(1);
  return newStr;
}

/**
 * 小写字符串首字母
 * @param str
 */
export function firstWordLower(str: string) {
  const newStr = str[0].toLowerCase() + str.slice(1);
  return newStr;
}

/**
 * 读取文件夹下的一个文件
 * @param dir 文件夹
 * @param testName 文件名正则
 */
export async function readFile(dir: string, testName: RegExp) {
  const dirs = await fs.readdir(dir);
  const name = dirs.find((item) => testName.test(item));
  if (typeof name === 'undefined') {
    return;
  }
  const file = await fs.readFile(path.join(dir, name));
  return file;
}

/**
 * 创建Import的AST
 * @param name
 * @param path
 */
export function makeDefaultImport(name: string, _path: string) {
  return t.importDeclaration(
    [
      t.importDefaultSpecifier(
        t.identifier(
          name
        )
      )
    ],
    t.stringLiteral(_path)
  );
}

/**
 * 追加Import
 * @param program
 * @param imprt
 */
export function appendImportStatement(programFile: t.Program | t.File, imprt: t.ImportDeclaration) {
  if (programFile.type === 'File') {
    programFile.program.body.unshift(imprt);

  } else {
    programFile.body.unshift(imprt);
  }
}

/**
 * 创建jsx
 * @param identifier
 * @param attr
 * @param selfClosing
 * @return jsxElement
 */
export function makeJsx(
  identifier: string,
  attr: Array<t.JSXAttribute | t.JSXSpreadAttribute> = [],
  children: Array<t.JSXText | t.JSXExpressionContainer | t.JSXSpreadChild | t.JSXElement | t.JSXFragment> = [],
  selfClosing = false) {
  const closeElement = selfClosing ? null : t.jsxClosingElement(t.jsxIdentifier(identifier));
  return t.jsxElement(
    t.jsxOpeningElement(t.jsxIdentifier(identifier), attr, selfClosing),
    closeElement,
    children,
    false
  );
}

/**
 * 得到render()中的return的jsx
 * @param program
 */
export function getRenderReturnJsx(programFile: t.File | t.Program) {
  let returnStatement: t.ReturnStatement;
  const exportDec = getExportDeclaration(programFile);
  if (!exportDec) {
    // tslint:disable-next-line:no-console
    console.error('未找到默认导出');
    return;
  }

  let comp = exportDec.declaration;

  if (comp.type === 'Identifier') {
    comp = getFunctionByName(programFile, comp.name)!;
  }

  if (comp.type !== 'ClassDeclaration' && comp.type !== 'FunctionDeclaration') {
    // tslint:disable-next-line:no-console
    console.error('默认导出不为React组件');
    return;
  }

  const renderMethod = getRenderMethod(comp.body);

  if (renderMethod) {
    returnStatement = getReturnStatement(renderMethod.body)!;
  } else {
    returnStatement = getReturnStatement(comp.body as t.BlockStatement)!;
  }

  if (!returnStatement) {
    // tslint:disable-next-line:no-console
    console.error('render函数中无返回值');
    return;
  }
  return returnStatement.argument as t.JSXElement;
}

/**
 * 得到ExportDeclaration
 * @param program
 * @return ExportDeclaration
 */
export function getExportDeclaration(programFile: t.File | t.Program) {
  let program = programFile;
  if (program.type === 'File') {
    program = (programFile as t.File).program;
  }
  for (let i = program.body.length - 1; i >= 0; i--) {
    if (program.body[i].type === 'ExportDefaultDeclaration') {
      return program.body[i] as t.ExportDefaultDeclaration;
    }
  }
}

/**
 * 得到render函数
 * @param cls
 */
export function getRenderMethod(statement: t.ClassBody | t.BlockStatement) {
  const body = statement.body;
  for (let i = 0; i < body.length; i++) {
    if (body[i].type !== 'ClassMethod') {
      continue;
    }
    if (((body[i] as t.ClassMethod).key as t.Identifier).name !== 'render') {
      continue;
    }
    return body[i] as t.ClassMethod;
  }
}

/**
 * 得到return函数
 * @param block
 */
export function getReturnStatement(block: t.BlockStatement) {
  const body = block.body;
  for (let i = 0; i < body.length; i++) {
    if (body[i].type === 'ReturnStatement') {
      return body[i] as t.ReturnStatement;
    }
  }
}

/**
 * 得到ast
 * @param code 代码
 */
export function parse(code: string | Buffer) {
  let codeStr = code;
  if (codeStr instanceof Buffer) {
    codeStr = codeStr.toString();
  }

  return parser.parse(codeStr, {
    sourceType: 'module',
    plugins: [
      'jsx',
      'objectRestSpread',
      'classProperties',
      'asyncGenerators',
      ['decorators', {
        decoratorsBeforeExport: true
      }] as any
    ]
  });
}

/**
 * 根据函数名称找到函数
 * @param programFile
 * @param name
 * @return functionDeclaration
 */
export function getFunctionByName(programFile: t.Program | t.File, name: string) {
  const body = programFile.type === 'File' ? programFile.program.body : programFile.body;
  for (let i = 0; i < body.length; i++) {
    if (body[i].type === 'FunctionDeclaration') {
      if (((body[i] as t.FunctionDeclaration).id as t.Identifier).name === name) {
        return body[i] as t.FunctionDeclaration;
      }
    }
  }
}

/**
 * 解析表达式数组
 * @param expres
 */
export function parseExpres(expres: Editor.PluginDataDriver.IExpression[], identifier: string) {
  let str = '';
  for (let i = 0; i < expres.length; i++) {
    const value = expres[i];
    if (typeof value === 'string') {
      // 如果是单纯的字符串
      str += value;
      continue;
    }

    // 如果是其它元素的属性
    if (value.id === -1) {
      // id为-1代表非组件属性
      str += value.property;
    } else {
      const p = value.property.split('.');
      if (p.length === 2) {
        str += `${identifier}[${value.id}]['${p[0]}']['${p[1]}']`;
      } else {
        str += p[0] === '' ? `${identifier}[${value.id}]` : `${identifier}[${value.id}]['${p[0]}']`;
      }
    }
  }

  return parser.parseExpression(str);
}

/**
 * option中的path进行map
 */
export function mapSrcPath(body: IBody, map: (p: string) => string) {
  traverser(body.data.root, {
    com: {
      enter: (node) => {
        node._srcPath = map(node.option.path);
      }
    }
  });
}

/**
 * url(xxxx) => xxx
 * @param url
 */
export function extractUrl(url: string) {
  if (/(?<=url\().*?(?=\))/.exec(url) === null) {
    return;
  }
  return /(?<=url\().*?(?=\))/.exec(url)![0];
}

/**
 * [{value: 'xx', property:'a.b.c'}] => {a:{b:{c: 'xx'}}
 * @param params
 */
export function toObjectExpression(params: Array<{ value: t.Expression, property: string }>) {
  const obj: { [p: string]: any } = {};
  params.forEach(({ value, property }) => {
    const properties = property.split('.');
    let tempObj = obj;
    properties.forEach((p, idx) => {
      if (idx === properties.length - 1) {
        tempObj[p] = value;
      } else {
        if (tempObj[p] === undefined) {
          tempObj[p] = {};
        }
        tempObj = tempObj[p];
      }
    });
  });

  // tslint:disable-next-line: no-shadowed-variable
  function toObj(obj: { [p: string]: any }): t.ObjectExpression {
    return t.objectExpression(
      Object.keys(obj).map((k) => t.objectProperty(
        t.identifier(k),
        t.isExpression(obj[k]) ? obj[k] : toObj(obj[k])
      ))
    );
  }

  return toObj(obj);
}
