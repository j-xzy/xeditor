/*
 * @Author: whj
 * @Email: wuhongjiang@hiynn.com
 * @Description: 工具
 * @Date: 2018-10-16
 * @Last Modified by: whj
 * @Last Modified time: 2018-11-07
*/

export function deepAsign<T extends object>(_des: T, _src: Editor.PluginEvent.IDeepPartial<T>): T {
  const clonedDes = JSON.parse(JSON.stringify(_des));

  function assgin(des: Partial<T>, src: Partial<T>) {
    for (const key in src) {
      if (Object.prototype.toString.call(src[key]) === '[object Object]') {
        assgin(des[key] as any, src[key] as any);
      } else {
        des[key] = src[key];
      }
    }
  }

  assgin(clonedDes, _src);

  return clonedDes;
}

/** 解析 top right bottom left的字符串 */
export function parsePaddingShotCutAttr(str: string) {
  function template(arg1: string, arg2: string, arg3: string, arg4: string) {
    return { top: arg1, right: arg2, bottom: arg3, left: arg4 };
  }
  return parseShotCutAttr(str, template);
}

/** 解析有四个属性的css */
function parseShotCutAttr(str: string, template: any) {
  const arr = str.split(' ');
  if (arr.length === 1) {
    return template(arr[0], arr[0], arr[0], arr[0]);
  }
  if (arr.length === 2) {
    return template(arr[0], arr[1], arr[0], arr[1]);
  }
  if (arr.length === 3) {
    return template(arr[0], arr[1], arr[2], arr[1]);
  }
  return template(...arr);
}

interface IVisitor {
  com?: IEnterExit;
  root?: IEnterExit;
  box?: IEnterExit;
  default?: IEnterExit;
}

interface IEnterExit {
  enter?: (node: Editor.IRootState, parent: Editor.IRootState | null) => void;
  exit?: (node: Editor.IRootState, parent: Editor.IRootState | null) => void;
}

/**
 * 遍历
 * @param root 节点
 * @param visitor 访问器
 */
export function traverser(root: Editor.IRootState, visitor: IVisitor) {

  function traverse(node: Editor.IRootState, parent: Editor.IRootState | null) {

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

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < node.children.length; i++) {
      traverse(node.children[i], node);
    }

    if (methods && methods.exit) {
      methods.exit(node, parent);
    }
  }

  traverse(root, null);
}
