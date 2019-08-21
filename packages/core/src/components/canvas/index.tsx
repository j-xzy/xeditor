import { EvtEmitter } from 'evt-emit';
import * as React from 'react';
import { EventType } from '../../lib/common';
import { Border } from '../border';
import { Outline } from '../outline';
import { Placeholder } from '../placeholder';
import { Context, IStores } from '../provider';
import { Resizer } from '../resizer';
import { Shade } from '../shade';
import { ToolBar } from '../toolbar';

export interface ICanvasProps {
  defaultStyle: Editor.ICanvasStyle;
  className?: string;
  noSelectedFeature?: (noSelectedFeature: () => void) => void;
  onError?: (err: string) => void;
  setCanvas?: (setCanvas: (data: Editor.ICanvaData) => void) => void;
  getStyle?: (getStyle: () => Editor.ICanvasStyle) => void;
  getData?: (getData: () => Editor.ICanvaState) => void;
  clear?: (clear: () => void) => void;
  undo?: (undo: () => void) => void;
  redo?: (redo: () => void) => void;
  onSwitchSelectedFeature?: (state: Editor.IFeatureInfo | null) => void;
}

class Canvas extends React.Component<ICanvasProps, {}> {

  public static defaultProps = {
    scale: 1,
    style: {}
  };

  public static contextType = Context;

  public context!: IStores;
  private canvasRef!: HTMLDivElement;

  constructor(props: ICanvasProps) {
    super(props);

    //#region bind events

    //#region MouseEvent
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    //#endregion

    //#region DragEvent
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    //#endregion

    this.undo = this.undo.bind(this);
    this.redo = this.redo.bind(this);
    this.clear = this.clear.bind(this);
    this.getData = this.getData.bind(this);
    this.setCanvas = this.setCanvas.bind(this);

    this.onError = this.onError.bind(this);
    this.handleRenderCanvas = this.handleRenderCanvas.bind(this);
    this.onSwitchStore = this.onSwitchStore.bind(this);
    this.noSelectedFeature = this.noSelectedFeature.bind(this);
    this.getCanvaStyle = this.getCanvaStyle.bind(this);
    //#endregion
  }

  //#region lifeCycle
  public render() {
    return (
      <div className={this.props.className} ref={(ref: HTMLDivElement) => this.canvasRef = ref} style={this.context.CanvaStore.Style}
        onMouseUp={this.handleMouseUp} onMouseMove={this.handleMouseMove} onMouseLeave={this.handleMouseLeave}
        onDragOver={this.handleDragOver} onDragLeave={this.handleDragLeave} onClick={this.handleClick}>

        {this.context.CanvaStore.renderFeature(this.context.FeatureStore.Root as Editor.IFeature)}

        <div style={{ width: '100%', height: '100%', position: 'absolute', pointerEvents: 'none', top: 0, left: 0, zIndex: 2 }}>
          <Resizer />
          <Border />
          <Placeholder />
          <ToolBar />
          <Outline />
          <Shade />
        </div>
      </div>
    );
  }

  public componentDidMount() {

    // 绑定props的回调方法
    this.bindPropsMethod();

    // 初始化根节点(需在Provider中使Canvas刷新一次)
    const root = this.context.FeatureStore.createRootFeature();
    this.context.FeatureStore.insertAsRoot(root);

    // canvaStore保存dom元素
    this.context.CanvaStore.dom = this.canvasRef;

    // 设置Canvas的初始样式(需在Provider中使Canvas刷新一次)
    this.context.CanvaStore.setStyle(this.props.defaultStyle);

    // 监听store更改
    this.context.CanvaStore.Store.subscribe(this.handleRenderCanvas);

    // 监听RenderCanvas事件
    EvtEmitter.Instance.subscribe(EventType.RenderCanvas, this.handleRenderCanvas);

    // 监听切换SelectedFeature(Store)事件
    EvtEmitter.Instance.subscribe(EventType.SwitchStore, this.onSwitchStore);

    // 监听error
    EvtEmitter.Instance.subscribe(EventType.Error, this.onError);

    // 插件的DidMount生命周期
    this.context.PluginControl.canvasDidMount();
  }

  public componentWillUnmount() {
    // 卸载store更新
    this.context.CanvaStore.Store.unSubscribe(this.handleRenderCanvas);

    // 卸载监听RenderCanvas
    EvtEmitter.Instance.unSubscribe(EventType.RenderCanvas, this.handleRenderCanvas);

    // 卸载监听切换SelectedFeature(Store)事件
    EvtEmitter.Instance.unSubscribe(EventType.SwitchStore, this.onSwitchStore);

    // 卸载监听error
    EvtEmitter.Instance.unSubscribe(EventType.Error, this.onError);

    // 插件的WillUnmount生命周期
    this.context.PluginControl.canvasWillUnmount();
  }
  //#endregion

  //#region event

  // 得到data
  private getData(): Editor.ICanvaState {
    return this.context.CanvaStore.getData();
  }

  // 撤销
  private undo() {
    this.context.CanvaStore.undo();
    this.setState({});
  }

  // 恢复
  private redo() {
    this.context.CanvaStore.redo();
    this.setState({});
  }

  private onError(error: string) {
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  // 清空
  private clear() {
    this.context.CanvaStore.clearCanvas();
    this.setState({});
  }

  private handleMouseUp(e: React.MouseEvent<HTMLDivElement>) {

    // 只响应鼠标左键的up事件
    if (e.button !== 0) {
      return;
    }

    // selectedFeature置为空
    // this.setSelectedFeaturNullWhileMouseUp();

    // 不再响应大小的改变
    this.context.CanvaStore.setResizingType('none');

    // 移动feature
    this.moveFeatureInFlow();

    // 恢复初始状态
    this.context.FeatureStore.updateIsMoving(false);
    this.context.FeatureStore.updateDragEnterFeature(null);
  }

  private handleClick(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
  }

  private handleMouseLeave() {
    // 回到初始状态
    this.setInitialStatus();
  }

  private handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {

    // 只响应鼠标左键的move事件
    if (e.buttons !== 1) {
      return;
    }

    // 更新feature的大小
    this.updateFeatureSize(e);

    // 更新移动时待插入的目标feature
    this.updateAimFeatureWhileMouseMove(e);

    // 移动feature
    this.moveFeatureNotInFlow(e);
  }

  private handleDragLeave() {
    // drag时离开canvas，不显示placeholder和parent的outline
    this.context.FeatureStore.updateDragEnterFeature(null);
  }

  private handleDragOver(e: React.DragEvent) {
    // 更新待插入的目标feature
    this.context.FeatureStore.updateAimsFeature(e.clientX, e.clientY);
  }

  private handleRenderCanvas(history = true) {
    if (history === true) {
      this.context.CanvaStore.takeSnapshot();
    }
    this.setState({});
  }
  //#endregion

  // 绑定props方法
  private bindPropsMethod() {
    if (this.props.undo) {
      this.props.undo(this.undo);
    }
    if (this.props.redo) {
      this.props.redo(this.redo);
    }
    if (this.props.clear) {
      this.props.clear(this.clear);
    }
    if (this.props.getData) {
      this.props.getData(this.getData);
    }
    if (this.props.setCanvas) {
      this.props.setCanvas(this.setCanvas);
    }
    if (this.props.noSelectedFeature) {
      this.props.noSelectedFeature(this.noSelectedFeature);
    }
    if (this.props.getStyle) {
      this.props.getStyle(this.getCanvaStyle);
    }
  }

  private getCanvaStyle() {
    return this.context.CanvaStore.CanvaStyle;
  }

  /** 更新feature的大小 */
  private updateFeatureSize(e: React.MouseEvent<HTMLDivElement>) {
    // 未选中<Resizer />
    if (this.context.CanvaStore.ResizingType === 'none') {
      return;
    }

    // 当前没有feature被选中
    if (!this.context.FeatureStore.SelectedFeature) {
      return;
    }

    const size = this.context.CanvaStore.getFeatureShouldSizeWhileMouseMove({ clientX: e.clientX, clientY: e.clientY });
    if (size === null) {
      return;
    }
    this.context.FeatureStore.SelectedFeature.updateSize(size.width, size.height);
  }

  /** 更新待插入的目标节点 在鼠标移动时 */
  private updateAimFeatureWhileMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    // movetool未mousedown
    if (!this.context.FeatureStore.IsMoving) {
      return;
    }

    // 当前没有feature被选中
    if (!this.context.FeatureStore.SelectedFeature) {
      return;
    }
    // absolute、fixed不改变插入的目标节点
    if (
      !this.context.FeatureStore.SelectedFeature.BaseStyle
      || this.context.FeatureStore.SelectedFeature.BaseStyle.position === 'absolute'
      || this.context.FeatureStore.SelectedFeature.BaseStyle.position === 'fixed'
    ) {
      return;
    }

    this.context.FeatureStore.updateAimsFeature(e.clientX, e.clientY);
  }

  /** 移动feature在文档流里 */
  private moveFeatureInFlow() {
    // 是否可以移动
    if (!this.context.FeatureStore.IsMoving) {
      return;
    }
    // 是否有元素被选中
    if (!this.context.FeatureStore.SelectedFeature) {
      return;
    }
    // 是否在文档流里,不在则不移动
    if (
      !this.context.FeatureStore.SelectedFeature.BaseStyle
      || this.context.FeatureStore.SelectedFeature.BaseStyle.position === 'absolute'
      || this.context.FeatureStore.SelectedFeature.BaseStyle.position === 'fixed') {
      return;
    }
    // 移动在文档流里的feature
    this.context.CanvaStore.moveInFlow();

    // 不显示<Resizer />，因为feature位置的改变无法通知<Resizer />
    // this.context.FeatureStore.updateSelectedFeature(null);

    // 更新Canvas
    EvtEmitter.Instance.emit(EventType.RenderCanvas, true);
  }

  /** 移动feature不在文档流里 */
  private moveFeatureNotInFlow(e: React.MouseEvent<HTMLElement>) {
    if (!this.context.FeatureStore.IsMoving) {
      return;
    }
    if (!this.context.FeatureStore.SelectedFeature) {
      return;
    }
    if (
      !this.context.FeatureStore.SelectedFeature.BaseStyle
      || this.context.FeatureStore.SelectedFeature.BaseStyle.position !== 'absolute'
      && this.context.FeatureStore.SelectedFeature.BaseStyle.position !== 'fixed') {
      return;
    }

    this.context.CanvaStore.moveNotInFlow({
      x: e.clientX,
      y: e.clientY
    });
  }

  private onSwitchStore(store: Editor.IStore<Editor.IFeatureState> | null) {
    // 没有onSwitchSelectedFeature这个Props
    if (!this.props.onSwitchSelectedFeature) {
      return;
    }

    const state = {
      option: {},
      id: -1,
      state: {},
      type: 'none' as Editor.IFeatureType
    };

    // 没有被选择的feature
    if (!this.context.FeatureStore.SelectedFeature) {
      this.props.onSwitchSelectedFeature(state);
      return;
    }

    state.option = this.context.FeatureStore.SelectedFeature.Option;
    state.id = this.context.FeatureStore.SelectedFeature.Store.getState().id!;

    // store 存在,不是选择的根节点
    if (store && this.context.FeatureStore.SelectedFeature !== this.context.FeatureStore.Root) {
      state.state = store.getState();
      state.type = 'node';
    }

    // store 不存在,选择的是根节点,将根节点认为是Canvas
    if (store === null && this.context.FeatureStore.SelectedFeature === this.context.FeatureStore.Root) {
      state.state = this.context.CanvaStore.CanvaStyle;
      state.type = 'canvas';
    }

    this.props.onSwitchSelectedFeature(state);
  }

  /** 回到初始状态 */
  private setInitialStatus() {
    // 移出canvas，不显示padding、margin
    this.context.FeatureStore.updateHoverFeature(null);

    // 移出canvas再移回不moveFeature
    this.context.FeatureStore.updateIsMoving(false);

    // 移出canvas，不显示placeholder
    this.context.FeatureStore.updateDragEnterFeature(null);
  }

  private noSelectedFeature() {
    this.context.FeatureStore.updateSelectedFeature(null);
  }

  // 设置canvas数据
  private setCanvas(data: Editor.ICanvaData) {
    this.context.CanvaStore.setCanvas(data);
  }
}

export { Canvas };
