declare namespace Editor {

  interface ICanvaStore {

    /**
     * 更改feature组件大小的方式，比如向下拖动Resizer 
     */
    ResizingType: Editor.IResizingType;

    /**
     * <Resizer /> 的大小位置
     * @returns IResizerStatus
     */
    ResizerStatus: IResizerStatus | null;

    //#endregion

    Store: Editor.IStore<ICanvaStoreState>;

    /**
     * Canvas样式
     */
    Style: React.CSSProperties;

    /**
     * store的state
     */
    State: ICanvaStoreState;

    /**
     * 带scale的Canvas样式
     */
    CanvaStyle: ICanvasStyle;

    /** 最后加入的feature */
    LastFeature: Editor.IFeature | null;

    /**
     * 隐藏的featureStore
     */
    HiddenFtrStores: Editor.IFeatureStore[];

    /**
     * 复制被选中的feature并且插入
     */
    copySelectedFtrAndInsert(): Editor.IFeature | undefined;

    /**
     * 根据id得到feature
     * @param id 
     */
    getFeatureById(id: number): Editor.IFeature | null;

    /**
     * 设置画布
     * @param data 画布数据
     */
    setCanvas(data: ICanvaData): void;

    /**
     * 清除画布
     */
    clearCanvas(): void;

    /**
     * 恢复
     */
    redo(): void;

    /**
     * 撤销
     */
    undo(): void;

    /**
     * pop历史
     */
    popHistory(): void;

    /**
     * 保存快照记录历史
     */
    takeSnapshot(): void;

    /**
   * 得到历史快照
   */
    getSnapshop(): IHistorySnapshot;


    /**
     * 设置canvas的样式
     * @param style 
     */
    setStyle(style: ICanvasStyle): void;

    /**
     * 增加feature的id
     * @param feature 
     */
    increaseFeatureStoreId(feature: Editor.IFeature): void;

    /**
     * 生成feature的id
     */
    generateId(): number;

    /**
     * 得到画布对象数据
     */
    getData(): ICanvaState;

    /**
     * 记录鼠标的位置，用于计算绝对定位下feature的位置
     * @param position 
     */
    setMouseDonwPosition(position: Editor.ICoordinate): void;

    /**
     * 设置feature的快照
     * @param snapShot 
     */
    setFeatureSnapShot(snapShot: Editor.ISize & Editor.ICoordinate): void;

    /**
     * 渲染features
     * @returns JSX.Element
     */
    renderFeature(feature: Editor.IFeature): JSX.Element;

    /**
     * 设置该怎样拖动sizeTool，比如向下拖动Resizer 
     * @param resizingType Editor.IResizingType
     */
    setResizingType(resizingType: Editor.IResizingType, coor?: Editor.ICoordinate): void

    /**
     * 设置Canvas的dom元素
     * @param dom HTMLElement
     */
    dom: HTMLElement;

    /**
     * 拖动Resizer时feature的大小
     * @param point Editor.IClientPosition
     * @returns Editor.ISize
     */
    getFeatureShouldSizeWhileMouseMove(point: Editor.IClientPosition): Editor.ISize | null;

    /**
     * 得到feature相对于Canvas的BoundingRect
     * @param feature IFeauture
     * @returns ClientRect
     */
    getFeatureBoundingRectByCanvas(feature: Editor.IFeature): ClientRect | null;

    /**
     * 得到相对于canvas的位置
     * @param x 
     * @param y 
     */
    getPositionByCanvas(x: number, y: number): Editor.ICoordinate

    /**
     *  移动当前selectFeature,在文档流里
     */
    moveInFlow(): void;

    /**
     * 移动当前selectFeature,不在在文档流里
     * @param coord 坐标
     */
    moveNotInFlow(coord: Editor.ICoordinate): void;

    /**
     * 新增一个featureStore
     * @param name 
     */
    appendHiddenFtrStore(name: string, option: Editor.IFeatureOption, reducer: Editor.IReducer<any>): Editor.IFeatureStore;

    /**
     * 得到hiddenFtrStore
     * @param name 
     */
    getHiddenFtrStore(name: string): Editor.IFeatureStore | undefined;

    /**
     * 新增feature
     * @param option 
     * @param reducer 
     * @param previewProps 
     * @param NestingWrappedFeatureComponentClass 
     */
    addFeature(option: Editor.IFeatureOption, reducer: Editor.IReducer<Editor.IFeatureState>, previewProps: any, NestingWrappedFeatureComponentClass?: Editor.IWrappedFeatureComponentClassOrFunc): void;
  }

  interface IResizerStatus {
    position: {
      left: string,
      top: string
    },
    size: Editor.ISize;
  }

  interface IRootData {
    option: Editor.IFeatureOption;
    state: Editor.IFeatureState;
    reducer: Editor.IReducer<Editor.IFeatureState>;
    props?: any;
    children: Array<IRootData>;
    component?: Editor.IWrappedFeatureComponentClassOrFunc;
  }

  interface IRootState {
    option: Editor.IFeatureOption;
    state: Editor.IFeatureState;
    children: Array<IRootState>;
  }

  interface ICanvaState {
    root: IRootState;
    hidden: IRootState[];
    canvas: ICanvaStoreState;
  }

  type ICanvaData = {
    canvas: ICanvaStoreState;
    root: IRootData;
    hidden: IRootData[];
  };

  type ICanvasStyle = React.CSSProperties & { scale: number };

  type IHistorySnapshot = {
    feature: Editor.IFeature;
    canvaState: ICanvaStoreState;
    hiddenFtrRoots: Editor.IFeature[];
  }

  interface ICanvaStoreState {
    name: 'canvaStore';
    id: 0;
    style: ICanvasStyle;
    [p: string]: any;
  }
}