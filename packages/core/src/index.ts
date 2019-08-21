// tslint:disable-next-line:no-reference
/// <reference path='../interface/featureComponent.d.ts'/>
// tslint:disable-next-line:no-reference
/// <reference path='../interface/other.d.ts'/>
// tslint:disable-next-line:no-reference
/// <reference path='../interface/css.d.ts'/>
// tslint:disable-next-line:no-reference
/// <reference path='../interface/feature.d.ts'/>
// tslint:disable-next-line:no-reference
/// <reference path='../interface/canvsa.d.ts'/>
// tslint:disable-next-line:no-reference
/// <reference path='../interface/tree.d.ts'/>
// tslint:disable-next-line:no-reference
/// <reference path='../interface/store.d.ts'/>
// tslint:disable-next-line:no-reference
/// <reference path='../interface/controlComponent.d.ts'/>
// tslint:disable-next-line:no-reference
/// <reference path='../interface/history.d.ts'/>
// tslint:disable-next-line:no-reference
/// <reference path='../interface/preview.d.ts'/>
// tslint:disable-next-line:no-reference
/// <reference path='../interface/canvasControl.d.ts'/>
// tslint:disable-next-line:no-reference
/// <reference path='../interface/plugin.d.ts'/>

import { initializeStyle } from './style';
initializeStyle(); // 初始化样式

import 'reflect-metadata'; // inversify所依赖metadata的polyfill
import * as _util from './lib/tool';

export const util = _util;
export { Canvas, ICanvasProps } from './components/canvas';
export { IPreviewClass, IProps as IPreviewProps } from './connector/featureConnector';
export { Provider } from './components/provider';
export { applyPlugins } from './applyPlugins';
export { canvasConnector } from './connector/canvasConnector';
export { controlConnector } from './connector/controlConnector';
export { featureConnector } from './connector/featureConnector';
export { pluginConnector } from './connector/pluginConnector';
export { Plugin } from './store/plugin';
export * from './store/tree';
export { useFeatureState } from './hooks/useFeatureState';
export { useFeatureDispatch } from './hooks/useFeatureDispatch';
export { useCanvasDispatch } from './hooks/useCanvasDispatch';
export { useCanvaState } from './hooks/useCanvaState';
export { usePlugin } from './hooks/usePlugin';
