const hasOwnProperty = Object.prototype.hasOwnProperty;

function uid() {
  let id = 0;
  return () => {
    return id++;
  };
}

/** 得到uid */
export const getUid = uid();

/** 判断是否是原生类型 */
export function throwIfCompositeComponentElement(element: any) {
  if (typeof element.type === 'string') {
    return;
  }
  const displayName = element.type.displayName || element.type.name || 'the component';
  throw new Error('只有原生类型才能够传入,你应该将 <div/> 包裹在 ' + displayName + ' 上');
}

/** 解析有四个属性的css */
export function parseShotCutAttr(str: string, template: (arg1: string, arg2: string, arg3: string, arg4: string) => any): any {

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
  return template.apply(null, [arr[0], arr[1], arr[2], arr[3]]);
}

/** 解析 top right bottom left的字符串 */
export function parsePaddingShotCutAttr(str: string): Editor.IPadding {

  function template(arg1: string, arg2: string, arg3: string, arg4: string) {
    return { top: arg1, right: arg2, bottom: arg3, left: arg4 };
  }

  return parseShotCutAttr(str, template);
}

export function is(x: any, y: any) {
  // SameValue algorithm
  if (x === y) {
    // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    // Added the nonzero y check to make Flow happy, but it is redundant
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    // Step 6.a: NaN == NaN
    return x !== x && y !== y;
  }
}

/** 浅比较 */
export function shallowEqual(objA: any, objB: any) {
  if (is(objA, objB)) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < keysA.length; i++) {
    if (!hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
}

/** 防抖 */
export function debounce<T extends any[]>(fn: (...p: T) => any, delay: number) {
  let timer: number;
  return function debounceClosure(this: void, ...args: T) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      return fn.apply(this, args);
    }, delay);
  };
}

// 合并reducer
export function combineReducer<T>(reducers: Array<Editor.IReducer<T>>) {
  return reducers.reduce((pre, curr) =>
    (action, state) => curr(action, pre(action, state))
  );
}

export function isPx(str: string | undefined) {
  if (typeof str === 'undefined') {
    return false;
  }
  if (/(^[\-0-9][0-9]*(.[0-9]+)?)$/.test(str)) {
    return true;
  }
  if (/(^[\-0-9][0-9]*(.[0-9]+)?)px$/.test(str)) {
    return true;
  }
  return false;
}
