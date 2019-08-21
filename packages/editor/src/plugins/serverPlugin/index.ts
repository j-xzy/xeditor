import { Plugin } from '@xeditor/core';

function rootReducer(_action: Editor.IAction, currState = { name: '服务' }) {
  return { ...currState, name: '服务' };
}

export class ServerPlugin extends Plugin {

  public static pluginName = 'ServerPlugin';

  public static initialState = {};

  public static reducer(_action: Editor.IAction, state: any) {
    return state;
  }

  constructor(private canvaStore: Editor.ICanvaStore) {
    super();
  }

  public canvasDidMount() {
    this.canvaStore.appendHiddenFtrStore('服务', { group: '服务' }, rootReducer);
  }

  public state() {
    return null;
  }
}
