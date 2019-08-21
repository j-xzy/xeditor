import { EvtEmitter } from 'evt-emit';
import { inject, injectable } from 'inversify';
import { EventType } from '../../lib/common';
import { Plugin } from '../plugin';
import { TYPES } from '../types';

@injectable()
export class PluginControl implements Editor.IPluginControl {

  private pluginMap: { [p: string]: { plugin: Editor.IPlugin, reducer: Editor.IReducer<any> } } = {};

  constructor(
    @inject(TYPES.CanvaStore) private canvaStore: Editor.ICanvaStore,
    @inject(TYPES.MainFeatureStore) private featureStore: Editor.IFeatureStore,
    @inject(TYPES.CanvaStoreDefaultReducer) defaultReducer: Editor.IReducer<Editor.ICanvaStoreState>
  ) {
    this.reducer = this.reducer.bind(this);
    this.beforeDispatch = this.beforeDispatch.bind(this);
    this.afterDispatch = this.afterDispatch.bind(this);

    this.pluginMap.Canvas = {
      plugin: new Plugin(),
      reducer: defaultReducer
    };
  }

  public getPluginByName(name: string) {
    if (!this.pluginMap[name]) {
      return;
    }
    return this.pluginMap[name].plugin;
  }

  public setPlugins(Plugins: Editor.INewabblPlugin[]) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < Plugins.length; i++) {
      const NewabblePlugin = Plugins[i];
      if (this.pluginMap[NewabblePlugin.pluginName]) {
        throw new Error('插件名不能相同!');
      }
      this.pluginMap[NewabblePlugin.pluginName] = {
        plugin: new NewabblePlugin(this.canvaStore, this.featureStore, this.refresh),
        reducer: NewabblePlugin.reducer
      };
    }
  }

  public reducer(action: Editor.IAction, currState: Readonly<any>) {
    let nextState: any = currState;
    // tslint:disable-next-line:forin
    for (const k in this.pluginMap) {
      nextState = this.pluginMap[k].reducer(action, nextState);
    }
    return nextState;
  }

  public beforeDispatch(action: Editor.IAction, state: Readonly<any>) {
    // tslint:disable-next-line:forin
    for (const k in this.pluginMap) {
      this.pluginMap[k].plugin.beforeDispatch(action, state);
    }
  }

  public afterDispatch(action: Editor.IAction, state: Readonly<any>) {
    // tslint:disable-next-line:forin
    for (const k in this.pluginMap) {
      this.pluginMap[k].plugin.afterDispatch(action, state);
    }
  }

  public canvasDidMount() {
    // tslint:disable-next-line:forin
    for (const k in this.pluginMap) {
      this.pluginMap[k].plugin.canvasDidMount();
    }
  }

  public canvasWillUnmount() {
    // tslint:disable-next-line:forin
    for (const k in this.pluginMap) {
      this.pluginMap[k].plugin.canvasWillUnmount();
    }
  }

  private refresh(history = true) {
    EvtEmitter.Instance.emit(EventType.RenderCanvas, history);
  }
}
