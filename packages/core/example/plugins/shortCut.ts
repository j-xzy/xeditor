import { Plugin } from '../../src/index';

export class ShortCut extends Plugin {

  // append到canvas的store的state上
  public static initialState = {
    foo: []
  };

  public static pluginName = 'ShortCut';

  // append到canvas的store的reducer上
  public static reducer(action: any, state: any) {
    return state;
  }

  private copyedFtr: Editor.IFeature | undefined;

  constructor(private canvaStore: Editor.ICanvaStore, private featureStore: Editor.IFeatureStore, private refresh: (history?: boolean) => void) {
    super();
    this.handleKeydown = this.handleKeydown.bind(this);
  }

  // ＜Canvas /> 组件被挂载时
  public canvasDidMount() {
    document.addEventListener('keydown', this.handleKeydown);
  }

  // ＜Canvas /> 组件将被卸载时
  public canvasWillUnmount() {
    document.removeEventListener('keydown', this.handleKeydown);
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
    return {
      bar: 'xxx1'
    };
  }

  private handleKeydown(e: KeyboardEvent) {
    // 复制
    if (e.ctrlKey && e.key === 'c' && this.featureStore.SelectedFeature && this.featureStore.SelectedFeature !== this.featureStore.SelectedFeature.FeatureStore.Root) {
      this.copyedFtr = this.featureStore.SelectedFeature.FeatureStore.copy(this.featureStore.SelectedFeature);
    }
    // 粘贴
    if (e.ctrlKey && e.key === 'v' && this.copyedFtr) {
      this.canvaStore.increaseFeatureStoreId(this.copyedFtr);
      this.copyedFtr.FeatureStore.insertAsFirstChild(this.copyedFtr.FeatureStore.Root!, this.copyedFtr);
      this.copyedFtr = this.copyedFtr.FeatureStore.copy(this.copyedFtr);
      this.canvaStore.Store.dispatch({ type: 'copyFeature', data: { newFtr: null, copyed: null } });
    }
    // 回退
    if (e.ctrlKey && e.key === 'z') {
      this.canvaStore.undo();
      this.refresh(false); // 刷新画布不记录历史
    }
    // 恢复
    if (e.ctrlKey && e.key === 'y') {
      this.canvaStore.redo();
      this.refresh(false); // 刷新画布不记录历史
    }

    if (e.key === 'Delete') {
      const selectedFtr = this.featureStore.SelectedFeature;
      if (!selectedFtr) {
        return;
      }
      selectedFtr.FeatureStore.removeNode(selectedFtr!);
      this.featureStore.updateSelectedFeature(null);
      this.refresh();
    }
  }
}
