import { usePlugin } from '@xeditor/core';
import { IChoosePluginState } from './plugin';

export function useChoose() {
  return usePlugin('ChoosePlugin') as IChoosePluginState;
}
