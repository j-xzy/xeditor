import { usePlugin } from '@xeditor/core';
import { IDataDriverPluginState } from '../plugin';

export function useDataDriver(): IDataDriverPluginState {
  return usePlugin('DataDriverPlugin');
}
