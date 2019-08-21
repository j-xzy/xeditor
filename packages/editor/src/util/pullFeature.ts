/*
 * @Author: whj
 * @Email: wuhongjiang@hiynn.com
 * @Description: 拉取组件(动态加载)
 * @Date: 2018-10-16
 * @Last Modified by: whj
 * @Last Modified time: 2018-11-14
*/

import { require } from 'requirejs-esmodule';

type ICallback = (err: string | null, param?: { component: Editor.IWrappedFeatureComponentClassOrFunc, option: Editor.IFeatureOption & { path: string }, reducer: Editor.IReducer<Editor.IFeatureState> }) => void;
interface IParam {
  component: Editor.IWrappedFeatureComponentClassOrFunc;
  option: Editor.IFeatureOption;
  reducer: Editor.IReducer<Editor.IFeatureState>;
}

export function pullFeature(path: string, timeOut: number, callback: ICallback) {
  let loaded = true;

  const time = setTimeout(() => {
    loaded = false;
    callback('tiemout');
  }, timeOut);

  require([path], (_param: IParam | { default: IParam }) => {
    if (loaded) {
      clearTimeout(time);

      let param: IParam;
      if ((_param as { default: IParam }).default) {
        param = (_param as { default: IParam }).default;
      } else {
        param = _param as IParam;
      }

      const optWithPath = { ...param.option, path };
      callback(null, { component: param.component, reducer: param.reducer, option: optWithPath });
    }
  });
}
