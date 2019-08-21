declare namespace Editor {
  /** feature集合的接口 */
  interface IFeatureStore extends Editor.ITree {
    /** 是否正在移动 */
    IsMoving: boolean;

    /** featureStore的store */
    Store: Editor.IStore<IFeatureStoreState>;

    /** 当前鼠标位置上feature */
    HoverFeature: IFeature | null;

    /** 当前选中的feature */
    SelectedFeature: IFeature | null;

    /** 创建feature函数 */
    createFeature(option: Editor.IFeatureOption, reducer: Editor.IReducer<IFeatureState>, props: any, FeatureComponentClass?: Editor.IFeatureComponentClass): IFeature;

    /** 被插入feature的目标feature */
    InsertedAimsFeature: IinsertedAimsFeature;

    /** 进入的feature */
    DragEnterFeature: IFeature | null;

    /** 上一次选中的feature  */
    LastSelectedFeature: IFeature | null;

    /** 是否为隐藏featureStore */
    IsHidden: boolean;

    /**
     * 移除node不触发dispatch（replace Node时调用）
     * @param node 
     */
    replaceNodeNoDispatchDelete(des: Editor.ITreeNode, newNode: Editor.ITreeNode): void;

    /**
     * 创建根节点
     */
    createRootFeature(): IFeature;

    /**
     * 刷新Tools(<Resize /> <Border />...)
     */
    refreshTools(): void;

    /**
     * 更新isMoveFlag
     * @param isMove 
     */
    updateIsMoving(isMove: boolean): void;

    /**
     * 将feature插入Tree 
     * @param feature IFeature
     */
    insertFeature(feature: IFeature): void;

    /**
     * 更新进入的feature
     * @param feature IFeature | null
     */
    updateDragEnterFeature(feature: IFeature | null): void;

    /**
     * 更改当前鼠标位置上feature
     * @param feature IFeature | null
     */
    updateHoverFeature(feature: IFeature | null): void;

    /**
     * 更新当前选中的feature的id
     * @param feature IFeature | null
     */
    updateSelectedFeature(feature: IFeature | null): void;

    /**
     * 更新插入目标节点
     * @param left number
     * @param top number
     */
    updateAimsFeature(left: number, top: number): void;

    /**
     * 得到一个深复制的feature(不能复制根结点)
     * @param feature 
     */
    copy(feature: IFeature): IFeature;
  }

  type IinsertedAimsFeature = { method: IinsertedMethod, feature: IFeature | null };

  type IinsertedMethod = 'predecessor' | 'successor' | 'child' | 'lastChild';

  /** Feature的接口 */
  interface IFeature extends Editor.ITreeNode {

    /** 是否需要更新<Resizer /> <Toolbar />标志位 */
    NeededUpDateTool: boolean;

    /** 错误组件标志位 */
    Error: boolean;

    /** 数据store */
    Store: Editor.IStore<IFeatureState>;

    /** 传入的props */
    OwnProps: any;

    /** feature的唯一标识 */
    Id: number;

    /** dom是否存在 */
    HasDom: boolean;

    /** 显示在画布上的组件类 */
    FeatureComponentClass: Editor.IFeatureComponentClass | undefined;

    /** 此feature是否是被copy出的 */
    IsCopy: boolean;

    /** 是否需要有Resizer组件 */
    Resizer: boolean;

    /** 是否需要又Toolbar组件  */
    Toolbar: boolean;

    /** 是否是容器组件 */
    Container: boolean;

    /** 组件基本的外观样式 */
    BaseStyle: Partial<IBaseStyle> | undefined;

    /** store的state */
    State: IFeatureState;

    /** 名称 */
    Name: string;

    /** 与浏览器边框的BoundingClientRect */
    BoundingClientRect: ClientRect | DOMRect | null;

    /** 得到计算style */
    ComputedStyle: CSSStyleDeclaration | null;

    /** option */
    Option: Editor.IFeatureOption;

    /** 其所属的featurestore */
    FeatureStore: IFeatureStore;

    /**
     * didMounted时设置Feature组件的Dom
     * @param dom 设置真实dom
     */
    setDom(dom: HTMLElement | null): void;

    /**
     * 更新组件大小
     * @param width string
     * @param height string
     */
    updateSize(width: string, height: string): void;

    /**
     * 更新位置
     * @param x 
     * @param y 
     */
    updatePosition(position: IPosition): void;

    /**
   * 改变baseStyle更改fature的Style
   * @param style 
   */
    updateBaseStyle(style: Partial<IBaseStyle>): void;
  }

  interface IFeatureInfo {
    state: IFeatureState | ICanvasStyle | {};
    option: Editor.IFeatureOption | {};
    id: number;
    type: IFeatureType;
  }

  type IFeatureType = 'none' | 'node' | 'canvas' | 'body';

  /** 创建Feature函数的接口 */
  interface ICreateFeature {
    (option: Editor.IFeatureOption, reducer: Editor.IReducer<IFeatureState>, props: any, featureStore: IFeatureStore, FeatureComponentClass?: Editor.IFeatureComponentClass): IFeature;
  }

  interface IFeatureState {
    readonly name: string;
    readonly style?: React.CSSProperties & Partial<IBaseStyle>;
    readonly id?: number; // 编辑器内部设置
    readonly [p: string]: any;
  }

  interface IFeatureStoreState {
    name: string;
    isMoving: boolean;
    selectedFeature: IFeature | null;
    hoverFeature: IFeature | null;
    insertedAimsFeature: IinsertedAimsFeature;
    dragEnterFeature: IFeature | null;
  }

  type IFeatureStoreActionType = 'name' | 'selectedFeature' | 'hoverFeature' | 'insertedAimsFeature' | 'dragEnterFeature' | 'isMoving'
    | 'delete' | 'insertAsRoot' | 'insertAsFirstChild' | 'insertAsPredecessor' | 'insertAsSuccessor' | '__init' | '__refresh';

  /** 创建Feature函数的接口 */
  interface ICreateFeatureStore {
    (name: string): IFeatureStore;
  }
}