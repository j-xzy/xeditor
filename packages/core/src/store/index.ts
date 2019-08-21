import { Container, interfaces } from 'inversify';
import { combineReducer } from '../lib/tool';
import { CanvaStore } from './canvaStore';
import { reducer as canvaStoreDefaultReducer } from './canvaStore/reducer';
import { Feature } from './feature';
import { reducer as ftrDefaultReducer } from './feature/reducer';
import { FeatureStore } from './featureStore';
import { createReducer } from './featureStore/reducer';
import { reducer as featureStoreReducer } from './featureStore/reducer';
import { History } from './history';
import { PluginControl } from './pluginControl';
import { ProxyStore } from './proxyStore';
import { Tree } from './tree';
import { TYPES } from './types';

const container = new Container();

container.bind<Editor.ITree>(TYPES.Tree).to(Tree);

container.bind<Editor.IFeatureStore>(TYPES.MainFeatureStore).to(FeatureStore).inSingletonScope();

container.bind<Editor.IFeatureStore>(TYPES.HiddenFeatureStore).to(FeatureStore);

container.bind<Editor.ICreateFeatureStore>(TYPES.FeatureStoreFactory).toFactory<Editor.IFeatureStore>((context: interfaces.Context) => {
  const factory: Editor.ICreateFeatureStore = (name: string) => {
    const featureStore = context.container.get<Editor.IFeatureStore>(TYPES.HiddenFeatureStore);
    featureStore.Store = context.container.get<Editor.ICreateProxyStore<any>>(TYPES.ProxyStoreFactory)(createReducer({ name }));
    return featureStore;
  };

  return factory;
});

container.bind<Editor.IPluginControl>(TYPES.PluginControl).to(PluginControl).inSingletonScope();

container.bind<interfaces.Newable<Editor.IFeature>>(TYPES.FeatureClass).toConstructor<Editor.IFeature>(Feature);

container.bind<Editor.IHistory<Editor.IHistorySnapshot>>(TYPES.History).to(History).inSingletonScope();

container.bind<interfaces.Newable<Editor.IStore<any>>>(TYPES.ProxyStoreClass).toConstructor<Editor.IStore<any>>(ProxyStore);

container.bind<Editor.IReducer<Editor.IFeatureStoreState>>(TYPES.FeatureStoreReducer).toFunction(featureStoreReducer);

container.bind<Editor.IReducer<Editor.ICanvaStoreState>>(TYPES.CanvaStoreDefaultReducer).toFunction(canvaStoreDefaultReducer);

container.bind<Editor.IReducer<Editor.IFeatureState>>(TYPES.FtrDefaultReducer).toFunction(ftrDefaultReducer as Editor.IReducer<Editor.IFeatureState>);

container.bind<Editor.ICanvaStore>(TYPES.CanvaStore).to(CanvaStore).inSingletonScope();

container.bind<Editor.ICreateFeature>(TYPES.FeatureFactory).toFactory<Editor.IFeature>((context: interfaces.Context) => {
  const factory: Editor.ICreateFeature = (option: Editor.IFeatureOption, reducer: Editor.IReducer<Editor.IFeatureState>, props: any, featureStore: Editor.IFeatureStore, FeatureComponentClass?: Editor.IFeatureComponentClass) => {
    const FeatureClass = context.container.get<interfaces.Newable<Editor.IFeature>>(TYPES.FeatureClass);
    const store = context.container.get<Editor.ICreateProxyStore<Editor.IFeatureState>>(TYPES.ProxyStoreFactory)(
      combineReducer([context.container.get(TYPES.FtrDefaultReducer), reducer])
    );

    return new FeatureClass(option, store, props, featureStore, FeatureComponentClass);
  };

  return factory;
});

container.bind<Editor.ICreateProxyStore<any>>(TYPES.ProxyStoreFactory).toFactory((context: interfaces.Context) => {
  const factory: Editor.ICreateProxyStore<any> = (reducer) => {
    const StoreClass = context.container.get<interfaces.Newable<Editor.IStore<any>>>(TYPES.ProxyStoreClass);
    const monitor = context.container.get<Editor.IPluginControl>(TYPES.PluginControl);

    return new StoreClass(reducer, monitor.beforeDispatch, monitor.afterDispatch);
  };

  return factory;
});

export { container };
