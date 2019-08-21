/**
 * 全局配置项
 */

import { devConfig } from './dev';
import { prodConfig } from './prod';

export const config = {
  ...process.env.NODE_ENV === 'production' ? prodConfig : devConfig,
  mock: false
};

window.config = config;
