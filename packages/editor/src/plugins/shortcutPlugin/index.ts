import { Plugin } from '@xeditor/core';

export class ShortCutPlugin extends Plugin {

  public static pluginName = 'ShortCutPlugin';

  public static initialState = {};

  public static reducer(_action: any, state: any) {
    return state;
  }

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

  private handleKeydown(e: KeyboardEvent) {

    this.handleUndo(e);

    this.handleRedo(e);

    this.handleDelete(e);
  }

  private handleUndo(e: KeyboardEvent) {
    if (e.ctrlKey && e.key === 'z') {
      this.canvaStore.undo();
      this.refresh(false); // 刷新画布不记录历史
    }
  }

  private handleRedo(e: KeyboardEvent) {
    if (e.ctrlKey && e.key === 'y') {
      this.canvaStore.redo();
      this.refresh(false); // 刷新画布不记录历史
    }
  }

  private handleDelete(e: KeyboardEvent) {
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
