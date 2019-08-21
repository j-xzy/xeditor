import { Plugin, Tree } from '@xeditor/core';

export type ILayerPluginState = ReturnType<LayerPlugin['state']>;

export class LayerPlugin extends Plugin {
  public static initialState = {};

  public static pluginName = 'LayerPlugin';

  public static reducer = (_action:  Editor.IAction, state: any) => state;

  private responsedActionNames = [
    'providerDidMount', 'providerWillUnmount',
    'delete', 'copyFeature', 'clearCanvas', 'undo', 'redo', 'setCanvas', 'insertAsLastChild',
    'insertAsFirstChild', 'insertAsPredecessor', 'insertAsSuccessor', 'appendChildFeatures'
  ];

  constructor(private canvaStore: Editor.ICanvaStore, private featureStore: Editor.IFeatureStore, private refresh: (history?: boolean) => void) {
    super();
    this.updateName = this.updateName.bind(this);
    this.updateVisible = this.updateVisible.bind(this);
    this.updateSelectedFeature = this.updateSelectedFeature.bind(this);
    this.move = this.move.bind(this);
  }

  public state() {
    return {
      roots: [this.featureStore.Root, ...this.canvaStore.HiddenFtrStores.map((ftr) => ftr.Root)] as Array<Editor.IFeature | undefined>,
      updateName: this.updateName,
      updateVisible: this.updateVisible,
      updateSelectedFtr: this.updateSelectedFeature,
      move: this.move,
      selectedId: this.featureStore.SelectedFeature ? this.featureStore.SelectedFeature.State.id : -1
    };
  }

  public afterDispatch(action: Editor.IAction) {
    if (this.responsedActionNames.includes(action.type)) {
      this.notify();
    }
    if (action.type === 'selectedFeature' && this.featureStore.LastSelectedFeature !== action.data) {
      this.notify();
    }
  }

  private updateSelectedFeature(id: number) {
    const result = this.canvaStore.getFeatureById(id);
    if (!result) {
      return this.featureStore.updateSelectedFeature(null);
    }
    this.featureStore.updateSelectedFeature(result);
  }

  private updateName(id: number, name: string) {
    const result = this.canvaStore.getFeatureById(id);
    if (!result) {
      return;
    }
    result.Store.dispatch({ type: 'name', data: name });
  }

  private updateVisible(id: number, visible: boolean) {
    const result = this.canvaStore.getFeatureById(id);
    if (!result) {
      return;
    }
    const visibility = visible ? 'visible' : 'hidden';
    result.Store.dispatch({ type: 'visibility', data: visibility });
    Tree.preTraverse(result.FirstChild, (node) => {
      (node as Editor.IFeature).Store.dispatch({ type: 'visibility', data: visibility });
    });
  }

  private move(sourceId: number, targetId: number, type: 'child' | 'predecessor' | 'successor') {
    const source = this.canvaStore.getFeatureById(sourceId);
    const target = this.canvaStore.getFeatureById(targetId);
    if (!source || !target) {
      return;
    }

    if (source.FeatureStore !== target.FeatureStore) {
      return;
    }

    if (source === target) {
      return;
    }

    if (type === 'child' && target.Option.container) {
      const childs = target.getChildren();
      if (childs.length === 0) {
        // 没有child
        source.FeatureStore.insertAsFirstChild(target, source.remove());
      } else if (childs[childs.length - 1] !== source) {
        source.FeatureStore.insertAsSuccessor(childs[childs.length - 1], source.remove());
      }
    }

    if (type === 'predecessor' && target !== source.FeatureStore.Root) {
      source.FeatureStore.insertAsPredecessor(target, source.remove());
    }

    if (type === 'successor' && target !== source.FeatureStore.Root) {
      source.FeatureStore.insertAsSuccessor(target, source.remove());
    }

    this.refresh();
  }
}
