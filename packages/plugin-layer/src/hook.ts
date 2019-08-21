import { usePlugin } from '@xeditor/core';
import { ILayerPluginState } from './plugin';

export function useLayer() {
  return usePlugin('LayerPlugin') as ILayerPluginState;
}
