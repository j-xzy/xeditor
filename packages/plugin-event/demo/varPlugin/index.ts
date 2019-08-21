import { Plugin } from '@xeditor/core';

function rootReducer(_action: IAction, currState = { name: '变量' }) {
  return { ...currState, name: '变量' };
}

export class VarPlugin extends Plugin {

  public static initialState = {};

  public static reducer(_action: IAction, state: any) {
    return state;
  }

  constructor(private canvaStore: ICanvaStore) {
    super();
  }

  public canvasDidMount() {
    this.canvaStore.appendHiddenFtrStore('变量', { group: '变量' }, rootReducer);
  }

  public state() {
    return null;
  }
}
