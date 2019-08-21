import { inject, injectable } from 'inversify';
import * as React from 'react';
import { featureAdvance } from '../../components/feature';
import { debounce } from '../../lib/tool';
import { COPY } from '../store';
import { Tree } from '../tree';
import { TYPES } from '../types';

@injectable()
export class CanvaStore implements Editor.ICanvaStore {

  // #region 属性
  // 更改feature组件大小的方式，比如向下拖动Resizer
  get ResizingType() {
    return this.resizingType;
  }

  // <Resizer /> 的大小位置
  get ResizerStatus() {
    if (!this.mainftrStore.SelectedFeature) {
      return null;
    }
    const style = this.mainftrStore.SelectedFeature.ComputedStyle;
    if (!style || typeof style.width === 'undefined' || typeof style.height === 'undefined') {
      return null;
    }

    const bound = this.getFeatureBoundingRectByCanvas(this.mainftrStore.SelectedFeature as Editor.IFeature);
    if (!bound) {
      return null;
    }

    return {
      size: { width: style.width!, height: style.height! },
      position: { left: bound.left + 'px', top: bound.top + 'px' }
    };
  }

  get Scale() {
    const scale = this.store.getState().style.scale;
    if (typeof scale === 'undefined') {
      return 1;
    }
    if (typeof scale === 'string') {
      return parseFloat(scale);
    }
    return scale;
  }

  get Store() {
    return this.store;
  }

  set Store(store: Editor.IStore<Editor.ICanvaStoreState>) {
    this.store = store;
  }

  get CanvaStyle() {
    return this.store.getState().style as Editor.ICanvasStyle;
  }

  get Style() {
    const { scale, ...style } = this.store.getState().style;
    return { ...style, transform: `scale(${scale})` };
  }

  get State() {
    return this.store.getState() as Editor.ICanvaStoreState;
  }

  set State(state: Editor.ICanvaStoreState) {
    this.store.dispatch({ type: COPY, data: state });
  }

  get LastFeature() {
    return this.lastFeature;
  }

  set LastFeature(feature: Editor.IFeature | null) {
    this.lastFeature = feature;
  }

  // 设置Canvas的dom元素
  set dom(dom: HTMLElement) {
    this.canvasDom = dom;
  }

  get HiddenFtrStores() {
    return [...this.hiddenFtrStores];
  }

  //#region 成员变量
  private canvasDom!: HTMLElement; // 画布真实dom元素
  private resizingType: Editor.IResizingType = 'none'; // 改变元素大小的方式（上下左右...）
  private featureSnapShot!: Editor.ISize & Editor.ICoordinate; // 快照，用于计算size,位置
  private mouseDonwPosition!: Editor.ICoordinate; // 记录鼠标mousedown的位置，用于计算绝对定位下feature的位置
  private featureLastId = 1; // feature的最后id, body是1
  private store!: Editor.IStore<Editor.ICanvaStoreState>;
  private hiddenFtrStores: Editor.IFeatureStore[] = []; // 不在画布上显示的featureStore数组
  private lastFeature: Editor.IFeature | null = null; // 最后添加的feature
  //#endregion

  // 注入featureStore(画布上的)
  constructor(
    @inject(TYPES.MainFeatureStore) private mainftrStore: Editor.IFeatureStore, // 保存着seletedFeature
    @inject(TYPES.FeatureStoreFactory) private featureStoreFactory: Editor.ICreateFeatureStore,
    @inject(TYPES.History) private history: Editor.IHistory<Editor.IHistorySnapshot>,
    @inject(TYPES.FeatureFactory) private featureFactory: Editor.ICreateFeature
  ) {
    this.takeSnapshot = debounce(this.takeSnapshot, 300).bind(this);
    this.getFeatureById = this.getFeatureById.bind(this);
  }

  public setStyle(style: Editor.ICanvasStyle) {
    this.store.dispatch({ type: 'style', data: style });
  }

  public setFeatureSnapShot(snapShot: Editor.ISize & Editor.ICoordinate) {
    this.featureSnapShot = snapShot;
  }

  public setMouseDonwPosition(position: Editor.ICoordinate) {
    this.mouseDonwPosition = position;
  }

  // 设置该怎样拖动sizeTool，比如向下拖动Resizer
  public setResizingType(type: Editor.IResizingType, coor?: Editor.ICoordinate) {
    this.resizingType = type;
    if (type !== 'none' && this.mainftrStore.SelectedFeature) {
      const style = this.mainftrStore.SelectedFeature.BaseStyle;
      if (!style || typeof style.width === 'undefined' || typeof style.height === 'undefined') {
        return;
      }
      this.featureSnapShot = { width: style.width, height: style.height, ...coor as Editor.ICoordinate };
    }
  }

  // 得到feature相对于canvas的位置
  public getFeatureBoundingRectByCanvas(feature: Editor.IFeature) {
    if (!feature.BoundingClientRect) {
      return null;
    }
    const { bottom, left, top, height, width } = feature.BoundingClientRect;
    const { left: cLeft, right: cRight, top: cTop } = this.canvasDom.getBoundingClientRect();

    return {
      bottom: (bottom - cTop) / this.Scale,
      height: height / this.Scale,
      left: (left - cLeft) / this.Scale,
      right: (cRight - cLeft) / this.Scale,
      top: (top - cTop) / this.Scale,
      width: width / this.Scale
    };
  }

  // 拖动Resizer时feature的大小
  public getFeatureShouldSizeWhileMouseMove(point: Editor.IClientPosition) {
    if (!this.mainftrStore.SelectedFeature) {
      return null;
    }

    const style = this.mainftrStore.SelectedFeature.BaseStyle;
    if (!style || typeof style.width === 'undefined' || typeof style.height === 'undefined') {
      return null;
    }

    let { width, height } = style;
    const { x, y, height: h, width: w } = this.featureSnapShot;
    const type = this.resizingType.toLocaleLowerCase();

    if (type.includes('bottom') || type.includes('top')) {
      const deltaY = (point.clientY - y) / this.Scale;
      height = parseFloat(h) + deltaY + 'px';
    }

    if (type.includes('right') || type.includes('left')) {
      const deltaX = (point.clientX - x) / this.Scale;
      width = parseFloat(w) + deltaX + 'px';
    }
    return { width, height };
  }

  // 渲染features
  public renderFeature(feature: Editor.IFeature) {
    const TreeObj: Editor.ITreeObj = {};
    let finalElement!: JSX.Element;
    Tree.inTraverse(feature, (node) => {
      const ftr: Editor.IFeature = (node as Editor.IFeature);

      let element: JSX.Element | null = null;

      if (TreeObj.hasOwnProperty(ftr.Id)) {
        // 创建带Children的element
        element = this.createFeatureElement(ftr, TreeObj[ftr.Id]);
      } else {
        // 创建不带Children的element
        element = this.createFeatureElement(ftr, null);
      }

      // 如果feature的parent存在
      if (ftr.Parent) {
        const parentId = (ftr.Parent as Editor.IFeature).Id;
        if (TreeObj.hasOwnProperty(parentId)) {
          TreeObj[parentId].push(element);
        } else {
          TreeObj[parentId] = [element];
        }
      }

      if (node === feature) {
        finalElement = element;
      }
    });

    return finalElement;
  }

  // 得到相对于canvas的位置
  public getPositionByCanvas(x: number, y: number): Editor.ICoordinate {
    const canvsaReact = this.canvasDom.getBoundingClientRect();
    return {
      x: x - canvsaReact.left,
      y: y - canvsaReact.top
    };
  }

  // 移动在文档流的的feature
  public moveInFlow() {
    const { DragEnterFeature, InsertedAimsFeature, SelectedFeature } = this.mainftrStore;
    // dragEnterFeature不存在
    if (!DragEnterFeature) {
      return;
    }

    // 代插入元素是否存在
    if (!InsertedAimsFeature.feature) {
      return;
    }

    // 是否有元素被选择
    if (SelectedFeature === null) {
      return;
    }

    // 代插入元素是否也是被选择元素
    if (InsertedAimsFeature.feature === SelectedFeature) {
      return;
    }

    // 插入的目标元素必须在文档流里面，除非是容器组件
    if (
      (
        typeof InsertedAimsFeature.feature.BaseStyle === 'undefined'
        || InsertedAimsFeature.feature.BaseStyle.position === 'absolute'
        || InsertedAimsFeature.feature.BaseStyle.position === 'fixed'
      )
      && !InsertedAimsFeature.feature.Option.container
    ) {
      return;
    }

    // 从tree中移除feature
    const feature = SelectedFeature.remove() as Editor.IFeature;

    // 将被移除的feature重新插入tree
    this.mainftrStore.insertFeature(feature);
  }

  public getData(): Editor.ICanvaState {
    const ftrRoot = this.mainftrStore.Root!;

    const root: Editor.IRootState = {
      option: (ftrRoot as Editor.IFeature).Option,
      state: (ftrRoot as Editor.IFeature).State,
      children: []
    };

    ftrRoot.getChildren().forEach((ftr) => {
      root.children.push(walk(ftr as Editor.IFeature));
    });

    const hiddenRoots = this.hiddenFtrStores.map((ftrStore) => ftrStore.Root as Editor.IFeature);
    const hidden: Editor.IRootState[] = hiddenRoots.map((hiddenRoot) => {
      return {
        option: (hiddenRoot as Editor.IFeature).Option,
        state: (hiddenRoot as Editor.IFeature).State,
        children: hiddenRoot.getChildren().map((node) => walk(node as Editor.IFeature))
      };
    });

    function walk(feature: Editor.IFeature) {
      const foo: Editor.IRootState = {
        option: feature.Option,
        state: feature.State,
        children: []
      };

      feature.getChildren().forEach((item) => {
        foo.children.push(walk(item as Editor.IFeature));
      });

      return foo;
    }

    return { root, hidden, canvas: this.State };
  }

  // 移动不在文档流里的Feature
  public moveNotInFlow(coord: Editor.ICoordinate) {
    const selectedFeature = this.mainftrStore.SelectedFeature;
    if (!selectedFeature) {
      return;
    }
    const deltaX = (coord.x - this.mouseDonwPosition.x) / this.Scale;
    const deltaY = (coord.y - this.mouseDonwPosition.y) / this.Scale;

    selectedFeature.updatePosition({
      left: this.featureSnapShot.x + deltaX + 'px',
      top: this.featureSnapShot.y + deltaY + 'px'
    });
  }

  public generateFeature(data: Editor.IRootData, featureStore: Editor.IFeatureStore) {
    // 记录feature最大的id
    if (data.state.id) {
      // tslint:disable-next-line:no-unused-expression
      data.state.id > this.featureLastId && (this.featureLastId = data.state.id);
    } else {
      // tslint:disable-next-line:no-console
      console.warn('id不存在!');
    }

    const ftr = featureStore.createFeature(data.option, data.reducer, data.props, data.component && featureAdvance(data.component));

    ftr.State = data.state;

    // store与feature中保持一致
    ftr.State.style && ftr.updateBaseStyle(ftr.State.style);

    data.children.forEach((item) => {
      featureStore.appendChild(ftr, this.generateFeature(item, featureStore));
    });

    return ftr;
  }

  // 生成feature的id
  public generateId() {
    return ++this.featureLastId;
  }

  public setCanvas(data: Editor.ICanvaData) {
    if (typeof this.mainftrStore.Root === 'undefined') {
      return;
    }

    this.setMainFeatureStore(data.root);

    this.setCanvaStore(data.canvas);

    this.setHiddenFeatureStore(data.hidden);

    this.Store.dispatch({ type: 'setCanvas', data });
  }

  // 清除画布
  public clearCanvas() {
    // 插入根节点
    this.mainftrStore.insertAsRoot(this.mainftrStore.createRootFeature());

    // hidden
    this.HiddenFtrStores.forEach((ftrStore) => {
      const { Option, Store: { Reducer } } = (ftrStore.Root as Editor.IFeature);
      const root = this.featureFactory(Option, Reducer, null, ftrStore);
      ftrStore.insertAsRoot(this.increaseFeatureStoreId(root));
    });

    // 记录了canvastyle的历史
    this.setStyle({ ...this.CanvaStyle, backgroundImage: 'url()' });
    this.mainftrStore.updateSelectedFeature(null);
    this.Store.dispatch({ type: 'clearCanvas', data: null });
  }

  // 撤销
  public undo() {
    this.history.undo();
    this.asyncState();
    this.Store.dispatch({ type: 'undo', data: null }, false); // 携带false使其handleRenderCanvas不记录历史
  }

  // 恢复
  public redo() {
    this.history.redo();
    this.asyncState();
    this.Store.dispatch({ type: 'redo', data: null }, false); // 携带false使其handleRenderCanvas不记录历史
  }

  // 得到快照
  public getSnapshop() {
    return this.history.getSnapshop();
  }

  // 快照
  public takeSnapshot() {
    // 最后添加的feature出错则不记录历史
    if (this.LastFeature && this.LastFeature.Error) {
      return;
    }

    this.history.takeSnapshot({
      feature: this.mainftrStore.copy(this.mainftrStore.Root as Editor.IFeature),
      canvaState: { ...this.State },
      hiddenFtrRoots: this.hiddenFtrStores.map((ftrStore) => ftrStore.copy(ftrStore.Root as Editor.IFeature))
    });
  }

  // pop
  public popHistory() {
    this.history.pop();
  }

  // 复制被选中的feature并且插入画布
  public copySelectedFtrAndInsert() {
    const selectedFeature = this.mainftrStore.SelectedFeature;
    if (!selectedFeature) {
      return;
    }

    const copyedFeature = this.mainftrStore.copy(selectedFeature);
    this.increaseFeatureStoreId(copyedFeature);

    if (typeof selectedFeature.BaseStyle === 'undefined') {
      return;
    }

    // 如果不在文档流里面
    if (selectedFeature.BaseStyle.position === 'absolute' || selectedFeature.BaseStyle.position === 'fixed') {
      let { left, top }: any = selectedFeature.ComputedStyle;
      left = parseInt(left, 10) + 30 + 'px';
      top = parseInt(top, 10) + 30 + 'px';
      // 偏移位置
      copyedFeature.State = {
        ...copyedFeature.State,
        style: {
          ...copyedFeature.State.style,
          left,
          top
        }
      };
    }

    this.mainftrStore.insertAsSuccessor(selectedFeature!, copyedFeature);

    this.mainftrStore.Store.dispatch({ type: 'copyFeature', data: { newFtr: copyedFeature, copyed: selectedFeature } });
    return copyedFeature;
  }

  public appendHiddenFtrStore(name: string, option: Editor.IFeatureOption, reducer: Editor.IReducer<any>) {
    const ftrStore = this.featureStoreFactory(name);
    const root = this.featureFactory(option, reducer, null, ftrStore);
    ftrStore.insertAsRoot(this.increaseFeatureStoreId(root));
    this.hiddenFtrStores.push(ftrStore);
    ftrStore.IsHidden = true;
    this.subscribeAllChildAndSelf(root, this.takeSnapshot);
    return ftrStore;
  }

  public getHiddenFtrStore(name: string) {
    return this.hiddenFtrStores.find((ftr) => ftr.Store.getState().name === name);
  }

  public increaseFeatureStoreId(feature: Editor.IFeature) {
    Tree.preTraverse(feature, (node) => {
      const ftr = node as Editor.IFeature;
      ftr.State = { ...ftr.State, id: this.generateId() };
    });
    return feature;
  }

  public addFeature(option: Editor.IFeatureOption, reducer: Editor.IReducer<Editor.IFeatureState>, previewProps: any, NestingWrappedFeatureComponentClass?: Editor.IWrappedFeatureComponentClassOrFunc) {
    let featureStore: Editor.IFeatureStore | undefined;

    if (typeof option.group === 'undefined' || option.group === '画布') {
      // 画布上的显示的
      featureStore = this.mainftrStore;
    } else {
      // 不在画布上显示
      featureStore = this.getHiddenFtrStore(option.group);
    }

    if (!featureStore) {
      return;
    }

    // 创建feature
    const feature = featureStore.createFeature(
      option,
      reducer,
      previewProps,
      NestingWrappedFeatureComponentClass && featureAdvance(NestingWrappedFeatureComponentClass)
    );

    // 不在画布上显示则绑定takeSnapshot。（在画布上显示的是在component的mount周期中绑定）
    !NestingWrappedFeatureComponentClass && feature.Store.subscribe(this.takeSnapshot);

    // 设置store的id
    this.increaseFeatureStoreId(feature);

    // 记录最后一次添加的feature
    this.LastFeature = feature;

    // 将feature插入tree中
    featureStore.insertFeature(feature);
  }

  public getFeatureById(id: number) {
    const roots: Editor.IFeature[] = [
      this.mainftrStore.Root as Editor.IFeature,
      ...this.HiddenFtrStores.map((featureStore) => featureStore.Root as Editor.IFeature)
    ];

    let ftr!: Editor.IFeature;
    for (let i = 0; i < roots.length; i++) {
      const root = roots[i];
      Tree.bfsTraverse<Editor.IFeature>(root, (node) => {
        if (node.State.id === id) {
          ftr = node;
          return true;
        }
      });
      if (ftr) {
        break;
      }
    }

    if (ftr) {
      return ftr;
    }

    return null;
  }

  // 同步状态
  private asyncState() {
    const { feature, canvaState, hiddenFtrRoots } = this.history.getSnapshop();

    // 同步画布上显示的组件状态,回退上一个root
    this.mainftrStore.insertAsRoot(this.mainftrStore.copy(feature));

    // 同步画布本身状态,回退上一个canvaState
    this.Store.dispatch({ type: COPY, data: canvaState }, false); // 携带false使其handleRenderCanvas不记录历史

    // 同步隐藏hiddenFeatureStore状态
    // 解除当前的所有hiddenStore的takesnapshot绑定
    this.unSubscribeAllHiddenSubscribe(this.takeSnapshot);
    hiddenFtrRoots.forEach((root, idx) => {
      const ftrStore = this.hiddenFtrStores[idx];
      const copyRoot = ftrStore.copy(root);
      // 坚挺takesnapshot
      this.subscribeAllChildAndSelf(copyRoot, this.takeSnapshot);
      // 替换根节点
      ftrStore.insertAsRoot(copyRoot);
    });

    // 更新SelectedFeature
    if (this.mainftrStore.SelectedFeature) {
      const id = this.mainftrStore.SelectedFeature.State.id!;
      const ftr = this.getFeatureById(id);
      setTimeout(() => {
        // 等待渲染完成,dom被挂载
        this.mainftrStore.updateSelectedFeature(ftr);
      }, 0);
    }
  }

  // 创建FeatureElement
  private createFeatureElement(feature: Editor.IFeature, children: any) {
    // as any 是因为featurestore和canvaStore等props是inject注入的
    return React.createElement(feature.FeatureComponentClass!, {
      key: feature.Id,
      feature,
      ownProps: feature.OwnProps,
      children
    });
  }

  private clearSubscribeAllChildAndSelf(ftr: Editor.IFeature, func: () => void) {
    Tree.inTraverse(ftr, (node) => {
      node.Store.unSubscribe(func);
    });
  }

  private unSubscribeAllHiddenSubscribe(func: () => void) {
    this.hiddenFtrStores.forEach((node) => {
      this.clearSubscribeAllChildAndSelf(node.Root as Editor.IFeature, func);
    });
  }

  private subscribeAllChildAndSelf(ftr: Editor.IFeature, func: () => void) {
    Tree.inTraverse(ftr, (node) => {
      node.Store.subscribe(func);
    });
  }

  private setMainFeatureStore(root: Editor.ICanvaData['root']) {
    this.mainftrStore.insertAsRoot(this.mainftrStore.createRootFeature());
    this.State = root.state as any;
    root.children.forEach((child) => {
      this.mainftrStore.appendChild(this.mainftrStore.Root!, this.generateFeature(child, this.mainftrStore));
    });
  }

  private setHiddenFeatureStore(roots: Editor.ICanvaData['hidden']) {
    roots.forEach((body, idx) => {
      const ftrStore = this.hiddenFtrStores[idx];
      if (!ftrStore || !ftrStore.Root) {
        return;
      }
      const reducer = (ftrStore.Root as Editor.IFeature).Store.Reducer;
      const root = this.featureFactory(body.option, reducer, null, ftrStore);
      root.State = body.state;
      ftrStore.insertAsRoot(root);
      body.children.forEach((child) => {
        ftrStore.appendChild(root, this.generateFeature(child, ftrStore));
      });
    });
  }

  private setCanvaStore(canvas: Editor.ICanvaData['canvas']) {
    this.Store.dispatch({ type: COPY, data: canvas });
  }
}
