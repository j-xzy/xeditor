/**
 * 1. 编辑器组件render中加入connect
 * 2. 某些库加入css (与库同名.css)
 * 3. 带js后缀的库去掉js (这样requirejs才能正确获取库的地址)
 */

const template = require('@babel/template').default;
const path = require('path');

let t;
const css = ['antd', 'leaflet', 'ol-commonjs'];

module.exports = function (babel, opt) {
  t = babel.types;
  return {
    visitor: {
      Program: {
        enter: function enter(path) {
          replaceImptJsExt(path.get('body').filter(path => path.type === 'ImportDeclaration'));
          appendCss(path);

          if (opt && opt.connect) {
            const exportDeclaration = path.get('body').find(path => path.type === 'ExportDefaultDeclaration').get('declaration');
            const comName = exportDeclaration.get('properties').find(path => path.node.key.name === 'component').node.value.name;
            const com = getComByName(path.get('body'), comName);

            replaceConnect(getReturn(com));
            replaceBoxRenderConnect(path.get('body'), getBoxNames(getConstructor(com)));
          }
        }
      }
    }
  };
};

function replaceImptJsExt(impts) {
  impts.forEach((impt) => {
    if (path.parse(impt.node.source.value).dir === '' && /\.js$/.test(impt.node.source.value)) {
      impt.node.source.value = impt.node.source.value.split(/.js$/)[0]
    }
  });
}

function appendCss(path) {
  // 得到css依赖
  const cssDep = [];　// 对css的依赖
  const imprts = getAllImport(path.get('body'));
  imprts.forEach((element) => {
    if (css.includes(element.node.source.value)) {
      cssDep.push(element.node.source.value);
    }
  });

  // 加入css
  cssDep.forEach((dep) => {
    path.get('body')[0].insertAfter([
      t.importDeclaration([], t.stringLiteral(`css!${dep}`))
    ])
  })
}

function getAllImport(body) {
  let paths = [];
  body.forEach((path) => {
    if (path.type === 'ImportDeclaration') {
      paths.push(path);
    }
  });
  return paths;
}

function getComByName(body, name) {
  return body.find(path => (path.type === 'ClassDeclaration' || path.type === 'FunctionDeclaration') && path.node.id.name === name);
}

function getReturn(com) {
  if (com.type === 'FunctionDeclaration') {
    return { statement: com.get('body').get('body').find(path => path.type === 'ReturnStatement'), type: 'FunctionDeclaration' };
  }
  if (com.type === 'ClassDeclaration') {
    const render = com.get('body').get('body').find(path => path.type === 'ClassMethod' && path.node.key.name === 'render');
    return { statement: render.get('body').get('body').find(path => path.type === 'ReturnStatement'), type: 'ClassDeclaration' };
  }
}

function replaceConnect({ statement, type }) {
  if (type === 'ClassDeclaration') {
    statement.get('argument').replaceWith(template('this.props.connect(CALLEE)')({
      CALLEE: statement.node.argument
    }));
  }
  if (type === 'FunctionDeclaration') {
    statement.get('argument').replaceWith(template('arguments[0].connect(CALLEE)')({
      CALLEE: statement.node.argument
    }));
  }
}

function getConstructor(com) {
  const body = com.get('body').get('body')
  for (let i = 0; i < body.length; i++) {
    if (body[i].node.kind === 'constructor') {
      return body[i]
    }
  }
}

function getBoxNames(constructorPath) {
  const elements = getBoxElements(constructorPath);
  const boxNames = new Set();
  elements.forEach(({ node }) => {
    for (let n = 0; n < node.properties.length; n++) {
      const property = node.properties[n];
      if (property.key.name === 'component') {
        boxNames.add(property.value.name);
      }
    }
  });

  return [...boxNames];
}

function getBoxElements(constructorPath) {
  let elements = []

  if (!constructorPath) {
    return elements;
  }

  const body = constructorPath.get('body').get('body');

  for (let i = 0; i < body.length; i++) {
    const node = body[i].node;
    if (node.type !== 'ExpressionStatement') {
      continue;
    }
    if (node.expression.type !== 'CallExpression') {
      continue;
    }
    if (node.expression.callee.type !== 'MemberExpression') {
      continue;
    }
    if (node.expression.callee.property.name !== 'appendChildFeatures') {
      continue;
    }
    elements = elements.concat(body[i].get('expression').get('arguments')[0].get('elements'))
  }

  return elements;
}

function replaceBoxRenderConnect(body, names) {
  for (let i = 0; i < names.length; i++) {
    const componentCls = getComByName(body, names[i]);
    replaceConnect(getReturn(componentCls));
    replaceBoxRenderConnect(body, getBoxNames(getConstructor(componentCls)));
  }
}
