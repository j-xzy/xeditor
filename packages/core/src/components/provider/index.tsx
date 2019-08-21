import * as React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { container } from '../../store';
import { TYPES } from '../../store/types';

export interface IStores {
  CanvaStore: Editor.ICanvaStore;
  FeatureStore: Editor.IFeatureStore;
  PluginControl: Editor.IPluginControl;
}

const canvaStore = container.get<Editor.ICanvaStore>(TYPES.CanvaStore);
canvaStore.Store = container.get<Editor.ICreateProxyStore<Editor.ICanvaStoreState>>(TYPES.ProxyStoreFactory)(
  container.get<Editor.IPluginControl>(TYPES.PluginControl).reducer
);

const featureStore = container.get<Editor.IFeatureStore>(TYPES.MainFeatureStore);
featureStore.Store = container.get<Editor.ICreateProxyStore<any>>(TYPES.ProxyStoreFactory)(
  container.get(TYPES.FeatureStoreReducer)
);

const stores: IStores = {
  CanvaStore: container.get(TYPES.CanvaStore),
  FeatureStore: container.get(TYPES.MainFeatureStore),
  PluginControl: container.get(TYPES.PluginControl)
};

export const Context = React.createContext(stores);

function RawProvider(props: React.Props<any>) {
  React.useEffect(() => {
    // didmount后更新store以更新canvasControl
    stores.CanvaStore.Store.dispatch({ type: 'providerDidMount', data: null });
    return () => {
      stores.CanvaStore.Store.dispatch({ type: 'providerWillUnmount', data: null });
    };
  }, []);
  return <Context.Provider value={stores}>{props.children}</Context.Provider>;
}

export const Provider = DragDropContext(HTML5Backend)(RawProvider);
