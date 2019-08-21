import { Plugin } from '../../src/index';

function reducer(_action: Editor.IAction, currState = { name: '变量' }) {
  return { ...currState, name: '变量' };
}

export class HiddenFtrStore extends Plugin {

  // append到canvas的store的state上
  public static initialState = {
    foo: []
  };

  public static pluginName = 'HiddenFtrStore';

  // append到canvas的store的reducer上
  public static reducer(action: any, state: any) {
    return state;
  }

  private ftrStore!: Editor.IFeatureStore;

  constructor(private canvaStore: Editor.ICanvaStore, private featureStore: Editor.IFeatureStore, private refresh: (history?: boolean) => void) {
    super();
  }

  // ＜Canvas /> 组件被挂载时
  public canvasDidMount() {
    this.ftrStore = this.canvaStore.appendHiddenFtrStore('变量', { group: '变量' }, reducer);
  }

  // 监听store的action
  public beforeDispatch(action: Editor.IAction, state: Readonly<any>) {
    // console.log('beforeDispatch', action.type);
  }

  // 监听store的action
  public afterDispatch(action: Editor.IAction, state: Readonly<any>) {
    // console.log('afterDispatch');
  }

  // 返回，在usePluginhook或pluginConnector中得到
  public state() {
    return null;
  }
}
