import { define, require } from 'requirejs-esmodule';

export const __config = {
  fontPath: '' // 字体路径
};

export function setConfig(_config: { requirejs: any, fontPath: string }) {
  require.config(_config.requirejs);
  __config.fontPath = _config.fontPath;
}

if ((window as any).define) {
  // tslint:disable-next-line:no-console
  console.log('define 已被定义');
} else {
  (window as any).define = define;
}
