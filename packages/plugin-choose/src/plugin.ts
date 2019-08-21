import { Plugin } from '@xeditor/core';

export type IChoosePluginState = ReturnType<ChoosePlugin['state']>;

export class ChoosePlugin extends Plugin {
  public static initialState = {};

  public static pluginName = 'ChoosePlugin';

  public static reducer(_action: Editor.IAction, state: any) {
    return state;
  }

  // 正在选择组件标识(不是select组件)
  private isChoosing = false;

  // 选择组件
  private chooseActionName: string = '';

  // listeners
  private listeners: { [p: string]: (state: Editor.IFeatureState | null) => void } = {};

  constructor(_canvaStore: Editor.ICanvaStore, private featureStore: Editor.IFeatureStore) {
    super();
    this.emitChooseAction = this.emitChooseAction.bind(this);
    this.cancelChooseAction = this.cancelChooseAction.bind(this);
    this.subscribeChoose = this.subscribeChoose.bind(this);
    this.unSubscribeChoose = this.unSubscribeChoose.bind(this);
  }

  public state() {
    return {
      emitChooseAction: this.emitChooseAction,　// 触发选中组件action
      cancelChooseAction: this.cancelChooseAction, // 取消选中组件action
      subscribeChoose: this.subscribeChoose, // 监听选中组件的action
      unSubscribeChoose: this.unSubscribeChoose // 取消选中组件的action的监听
    };
  }

  public beforeDispatch(action: Editor.IAction) {
    // 选中组件之前
    if (action.type === 'selectedFeature') {
      // 事件需要选中一个组件且组件存在
      if (this.isChoosing && action.data !== null) {
        // 调用选中组件相关逻辑
        this.handleChooseComp(action);
      }
    }
  }

  // 处理选择组件逻辑
  public handleChooseComp(action: Editor.IAction) {
    if (this.chooseActionName !== '' && typeof this.listeners[this.chooseActionName] !== 'undefined') {
      this.listeners[this.chooseActionName](action.data.State);
      // 选择组件，不被选中(select),还是上一次被选中的组件
      action.data = this.featureStore.SelectedFeature;
    }
    this.isChoosing = false;
    this.chooseActionName = '';
  }

  // 发起一个选择组件的action
  private emitChooseAction(actionName: string) {
    this.isChoosing = true;
    for (const k in this.listeners) {
      if (k !== actionName) {
        this.listeners[k](null);
      }
    }
    this.chooseActionName = actionName;
  }

  // 取消选择组件的action
  private cancelChooseAction() {
    this.isChoosing = false;
  }

  private subscribeChoose(name: string, callback: (state: Editor.IFeatureState | null) => void) {
    this.listeners[name] = callback;
  }

  private unSubscribeChoose(name: string): any {
    delete this.listeners[name];
  }
}
