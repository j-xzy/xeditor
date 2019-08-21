import { Plugin } from '@xeditor/core';
import { Factory } from './lib/factory';
import { Node } from './node';

export type IDataDriverPluginState = ReturnType<DataDriverPlugin['state']>;

export class DataDriverPlugin extends Plugin {

  public static pluginName = 'DataDriverPlugin';

  public static initialState: Pick<Editor.ICanvaStoreState, 'dataDriver'> = {
    dataDriver: {}
  };

  public static reducer(action: Editor.IAction, state: any) {
    if (action.type === 'dataDriver') {
      return { ...state, dataDriver: action.data };
    }
    return state;
  }

  private bindedMap: { [id: number]: { [property: string]: Node } } = {};

  constructor(private canvaStore: Editor.ICanvaStore, private featureStore: Editor.IFeatureStore) {
    super();
    this.dispatch = this.dispatch.bind(this);
    this.getBinded = this.getBinded.bind(this);
    this.getAllBindedById = this.getAllBindedById.bind(this);
    this.syncDataDriverState = this.syncDataDriverState.bind(this);
    this.getFeatureById = this.getFeatureById.bind(this);
  }

  public state() {
    return {
      getBinded: this.getBinded,
      getAllBindedById: this.getAllBindedById,
      dispatch: this.dispatch,
      getFeatureById: this.getFeatureById,
      getDataDriverState: () => this.canvaStore.State.dataDriver
    };
  }

  public afterDispatch(action: Editor.IAction) {
    if (action.type === 'delete') {
      this.handleDelete(action.data);
    }
    if (action.type === 'copyFeature') {
      this.handleCopy(action.data);
    }
    if (action.type === 'undo' || action.type === 'redo') {
      this.handleUnRedo();
    }
    if (action.type === 'clearCanvas') {
      this.handleClearCanvas();
    }
    if (action.type === 'setCanvas') {
      this.stateToNode();
     }
  }

  public syncDataDriverState() {
    this.canvaStore.Store.dispatch({ type: 'dataDriver', data: this.nodeToState() });
  }

  public notify() {
    super.notify();
  }

  public getFeatureById(id: number) {
    return this.canvaStore.getFeatureById(id);
  }

  private handleDelete(ftr: Editor.IFeature) {
    for (const id in this.bindedMap) {
      if (id === ftr.State.id!.toString()) {
        delete this.bindedMap[id];
      } else {
        for (const property in this.bindedMap[id]) {
          this.bindedMap[id][property].clear(ftr.State.id!);
        }
      }
    }
    this.syncDataDriverState();
    this.notify();
  }

  private handleCopy(data: any) {
    const copyedId = data.copyed.State.id;
    const newId = data.newFtr.State.id;
    if (!this.bindedMap[copyedId]) {
      return;
    }

    this.bindedMap[newId] = {};
    for (const property in this.bindedMap[copyedId]) {
      const clonedNode = this.bindedMap[copyedId][property].clone();
      clonedNode.compId = newId;
      this.bindedMap[newId][property] = clonedNode;
    }
    this.syncDataDriverState();
  }

  private handleClearCanvas() {
    this.bindedMap = {};
    this.syncDataDriverState();
    this.notify();
  }

  private handleUnRedo() {
    this.stateToNode();
    this.notify();
  }

  private dispatch(type: 'new' | 'delete', data?: any) {
    if (type === 'new') {
      if (!this.featureStore.SelectedFeature) {
        return;
      }
      const { id, property } = data;
      if (!this.bindedMap[id]) {
        this.bindedMap[id] = {};
      }
      this.bindedMap[id][property] = Factory.Instance.emptyNode(this, id, property);
    }
    if (type === 'delete') {
      const { id, property } = data;
      if (typeof property === 'undefined') {
        delete this.bindedMap[id];
      } else if (this.bindedMap[id]) {
        delete this.bindedMap[id][property];
      }
    }
    this.syncDataDriverState();
    this.notify();
  }

  private getBinded(compId: number, property: string) {
    const compBinded = this.bindedMap[compId];
    if (!compBinded) {
      return;
    }
    return compBinded[property];
  }

  private getAllBindedById(compId: number) {
    return this.bindedMap[compId];
  }

  private nodeToState() {
    const dataDriver: Editor.ICanvaStoreState['dataDriver'] = {};
    for (const id in this.bindedMap) {
      dataDriver[id] = {};
      for (const property in this.bindedMap[id]) {
        dataDriver[id][property] = this.bindedMap[id][property].State;
      }
    }
    return dataDriver;
  }

  private stateToNode() {
    const dataDriver = this.canvaStore.State.dataDriver;
    this.bindedMap = {};
    for (const id in dataDriver) {
      this.bindedMap[id] = {};
      for (const property in dataDriver[id]) {
        const exps = dataDriver[id][property].value;
        this.bindedMap[id][property] = Factory.Instance.Node(this, parseInt(id, 10), property, exps);
      }
    }
  }
}
