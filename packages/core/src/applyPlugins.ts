import { container } from './store';
import { COPY } from './store/store';
import { TYPES } from './store/types';

export function applyPlugins(plugs: Editor.INewabblPlugin[]) {
  container.get<Editor.IPluginControl>(TYPES.PluginControl).setPlugins(plugs);
  const canvaStoreStore = container.get<Editor.ICanvaStore>(TYPES.CanvaStore).Store;

  let nextState = canvaStoreStore.getState();

  plugs.forEach(({ initialState }) => {
    nextState = { ...initialState, ...nextState };
  });

  // 合并state到canvas上
  canvaStoreStore.dispatch({ type: COPY, data: nextState });
}
