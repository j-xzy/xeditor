import { IExpression } from './index';

export function validExp(expres: IExpression[]) {
  // 懒加载
  return import(/* webpackChunkName: "@babel/parser" */ '@babel/parser').then((parser) => {
    try {
      let str = '';
      for (let i = 0; i < expres.length; i++) {
        const value = expres[i];
        if (typeof value === 'string') {
          str += value;
          continue;
        }
        const p = value.property.split('.');
        if (p.length === 2) {
          str += `state[${value.id}]['${p[0]}']['${p[1]}']`;
        } else {
          str += p[0] === '' ? `state[${value.id}]` : `state[${value.id}]['${p[0]}']`;
        }
      }
      if (str === '') {
        return {
          err: false,
          msg: 'success'
        };
      }
      parser.parseExpression(str);
      return {
        err: false,
        msg: 'success'
      };
    } catch (e) {
      return {
        err: true,
        msg: e.message
      };
    }
  }).catch(() => '加载@babel/parser发生错误');
}
