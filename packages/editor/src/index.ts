// tslint:disable-next-line:no-reference
/// <reference path='../interface/index.d.ts'/>

import { applyPlugins } from '@xeditor/core';
import { ChoosePlugin } from '@xeditor/plugin-choose';
import { DataDriverPlugin } from '@xeditor/plugin-data-driver';
import { EventPlugin } from '@xeditor/plugin-event';
import { LayerPlugin } from '@xeditor/plugin-layer';
import { CanvasPlugin } from './plugins/canvasPlugin';
import { ServerPlugin } from './plugins/serverPlugin';
import { ShortCutPlugin } from './plugins/shortcutPlugin';
import { VarPlugin } from './plugins/varPlugin';

// 启用插件
applyPlugins([ShortCutPlugin, CanvasPlugin, ChoosePlugin, EventPlugin, LayerPlugin, VarPlugin, ServerPlugin, DataDriverPlugin]);

export { setConfig } from './setConfig';

export { Canvas } from './components/canvas';

export { VarComp } from './plugins/varPlugin/varComp';

export { ApiComp } from './plugins/serverPlugin/apiComp';

export { Box } from './components/box';

// util
export { advanceReducer, IAdvanceFeatureInfo as IFeatureInfo } from './util/advanceReducer';

export { pullFeature } from './util/pullFeature';

export { enpowerCanvasData } from './util/enpowerData';

export { advanceOption } from './util/advanceOption';

export { appendFont } from './lib/appendFont';

// loadingCom
export { LoadingCom, loadingOption, loadingReducer, loadingState } from './components/loadingCom';

// dynamic
export { DynamicFeature, IDynamicFeatureProps } from './components/dynamicFeature';

// widget
export * from './components/layerWidget';
export * from './components/eventWidget';
export * from '@xeditor/expression';

// origin plugin
export { canvasConnector, controlConnector, useCanvaState, useCanvasDispatch, useFeatureDispatch, useFeatureState, Tree, Provider, featureConnector } from '@xeditor/core';
export { useDataDriver, IDataDriverPluginState } from '@xeditor/plugin-data-driver';
export { useEvent } from '@xeditor/plugin-event';
