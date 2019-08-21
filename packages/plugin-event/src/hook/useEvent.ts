import { usePlugin } from '@xeditor/core';
import { IEventPluginState } from '../plugin';

export function useEvent(): IEventPluginState {
  return usePlugin('EventPlugin');
}
