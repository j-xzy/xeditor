import { Plugin } from '@xeditor/core';
import { Factory } from './lib/factory';
import { Uid } from './lib/uid';
import { Action, Condition, Event, EventRoot, Expression, ForLoop, PropertyExpression, WhileLoop, WithTreeNode } from './node';
import { BaseNode } from './node/baenode';

export type IEventPluginState = Readonly<ReturnType<EventPlugin['state']>>;

export class EventPlugin extends Plugin {

  public static pluginName = 'EventPlugin';

  // 需使控件更新的action
  public static responsedActionNames = [
    'providerDidMount', 'providerWillUnmount' // 应用的action
  ];

  // 插件为canvaStore.store新增的事件模型字段
  public static initialState: Pick<Editor.ICanvaStoreState, 'eventState'> = {
    eventState: {
      type: 'EventRoot',
      state: { id: 0, disabled: false },
      children: []
    }
  };

  // canvaStore.store的响应逻辑
  public static reducer(action: Editor.IAction, state: any) {
    if (action.type === 'eventState') {
      return { ...state, eventState: action.data };
    }
    return state;
  }

  // 事件模型树状根节点
  private eventRoot = Factory.Instance.EventRoot(this, { id: 0, disabled: false });

  // 正在选择组件标识(不是select组件)
  private isChoosingComp = false;

  // listeners
  private listeners: { [p: string]: (state: Editor.IFeatureState | null) => void } = {};

  // 选择组件
  private chooseCopActionName: string = '';

  // 当前选中的node节点
  private currNode: BaseNode | null = null;

  constructor(private canvaStore: Editor.ICanvaStore, private featureStore: Editor.IFeatureStore) {
    super();

    this.eventRootToState = this.eventRootToState.bind(this);
    this.emptyEvent = this.emptyEvent.bind(this);
    this.newNode = this.newNode.bind(this);
    this.move = this.move.bind(this);
    this.setCurrNode = this.setCurrNode.bind(this);
    this.freshTree = this.freshTree.bind(this);
    this.getFeatureById = this.getFeatureById.bind(this);
  }

  // 插件的hook或connector时以props时返回
  public state() {
    return {
      eventNode: this.eventRoot,　// 事件根节点
      getEvenState: () => this.canvaStore.State.eventState,
      emptyEvent: this.emptyEvent,　// 新增事件节点
      newNode: this.newNode, // 新增节点
      move: this.move,
      getFeatureById: this.getFeatureById,　// 根据组件id找到组件的state和option
      getCurrNode: () => this.currNode,
      setCurrNode: this.setCurrNode
    };
  }

  public getFeatureById(id: number) {
    return this.canvaStore.getFeatureById(id);
  }

  // canvas被挂载后
  public canvasDidMount() {
    // 同步state
    this.eventRootToState();
  }

  public beforeDispatch(action: Editor.IAction) {
    // 选中组件之前
    if (action.type === 'selectedFeature') {
      // 事件需要选中一个组件且组件存在
      if (this.isChoosingComp && action.data !== null) {
        // 调用选中组件相关逻辑
        this.handleChooseComp(action);
      }
    }
  }

  public freshTree() {
    this.notify();
  }

  // 执行reducer之后触发
  public afterDispatch(action: Editor.IAction) {
    if (action.type === 'delete') {
      // 处理删除组件逻辑
      this.handleDeleteFtr(action);
    }

    if (action.type === 'copyFeature') {
      // 处理复制组件逻辑
      this.handleCopyFtr(action);
    }

    if (action.type === 'clearCanvas') {
      // 处理清空画布逻辑
      this.handleClearCanvas();
    }

    if (['undo', 'redo', 'setCanvas'].includes(action.type)) {
      // 同步stateObject与tree,
      // stateObject => tree
      this.stateToEventRoot();
      this.notify();
    }

    if (EventPlugin.responsedActionNames.includes(action.type)) {
      // 通知控件更新
      this.notify();
    }
  }

  // 处理选择组件逻辑
  public handleChooseComp(action: Editor.IAction) {
    if (this.chooseCopActionName !== '' && typeof this.listeners[this.chooseCopActionName] !== 'undefined') {
      this.listeners[this.chooseCopActionName](action.data.State);
      // 选择组件，不被选中(select),还是上一次被选中的组件
      action.data = this.featureStore.SelectedFeature;
    }
    this.isChoosingComp = false;
    this.chooseCopActionName = '';
  }
  // #endregion

  // 更新Store.eventNode
  public eventRootToState() {
    this.canvaStore.Store.dispatch({ type: 'eventState', data: this.treeToState() });
  }

  // 处理复制ftr的action
  private handleCopyFtr(action: Editor.IAction) {
    const copyedId = action.data.copyed.State.id;
    const newId = action.data.newFtr.State.id;
    let shouldSync = false;

    this.eventRoot.getChildren().forEach((node) => {
      if ((node as Event).sourceId === copyedId) {
        shouldSync = true;
        const clonedNode = (node as Event).clone();
        clonedNode.sourceId = newId;
        this.eventRoot.appendChild(clonedNode);
      }
    });

    if (shouldSync) {
      this.eventRootToState();
      this.notify();
    }
  }

  // 处理清除画布的action
  private handleClearCanvas() {
    this.eventRoot = Factory.Instance.EventRoot(this, { id: 0, disabled: false });
    this.eventRootToState();
  }

  // 处理删除组件的action
  private handleDeleteFtr(action: Editor.IAction) {
    const ftrId = (action.data as Editor.IFeature).State.id as number;
    this.eventRoot.clear(ftrId);
    this.eventRootToState();
  }

  // 创建node
  private generateNode(eNode: Editor.PluginEvent.IEventState) {
    const node: BaseNode = (Factory.Instance as any)[eNode.type](this, eNode.state);

    // 记录最大id
    if (node.id > Uid.instance.Id) {
      Uid.instance.Id = node.id;
    }

    const withData: Array<WithTreeNode<BaseNode>> = [];

    if (node instanceof Action) {
      if (isWithPropertyExp(node.data)) {
        withData.push(...node.data.getChildren().map((exp) => exp.data));
      }
      withData.push(node.data);
    }

    if (node instanceof Condition) {
      withData.push(node.leftExp, node.rightExp);
    }

    if (node instanceof Event || node instanceof WhileLoop) {
      const exps: Array<WithTreeNode<Expression>> = [];
      node.condition.getChildren().forEach((cond) => exps.push(cond.leftExp, cond.rightExp));
      withData.push(node.condition, ...exps);
    }

    if (node instanceof ForLoop) {
      withData.push(node.countExp);
    }

    withData.forEach((withItem) => {
      withItem.getChildren().forEach((cNode) => {
        if (cNode.id > Uid.instance.Id) {
          Uid.instance.Id = cNode.id;
        }
      });
    });

    eNode.children.forEach((child) => {
      node.appendChild(this.generateNode(child));
    });

    return node;
  }

  // 创建新的event节点
  private emptyEvent(compId: number) {
    const newNode = Factory.Instance.EmptyEvent(this);
    (newNode as Event).sourceId = compId;
    this.eventRoot.appendChild(newNode as Event);
    this.eventRootToState();
    this.notify();
  }

  private setCurrNode(node: BaseNode | null) {
    this.currNode = node;
    this.notify();
  }

  // 创建新节点
  private newNode(type: 'EmptyTime' | 'EmptyAction' | 'EmptyCondition' | 'EmptyForLoop' | 'EmptyWhileLoop' | 'EmptyWithCondition', _node?: BaseNode | null, data?: any) {
    const node = _node || this.currNode;
    if (!node) {
      return;
    }
    node.dispatch(type, data);
  }

  // 移动
  private move(source: BaseNode, target: BaseNode, type: 'child' | 'successor' | 'predecessor') {
    if (source === target) {
      return;
    }

    if (type === 'child') {
      if (target.type === 'Action') {
        return;
      }
      target.appendChild(source.remove());
    }

    if (type === 'successor') {
      target.insertAsSuccessor(source.remove());
    }

    if (type === 'predecessor') {
      target.insertAsPredecessor(source.remove());
    }
    this.eventRootToState();
    this.notify();
  }

  // 同步stateObject与tree
  private stateToEventRoot() {
    (this.eventRoot as any) = null;
    this.eventRoot = this.generateNode(this.canvaStore.State.eventState) as EventRoot;
  }

  // 同步stateObject与tree
  private treeToState() {
    const root: Editor.PluginEvent.IEventState = walk(this.eventRoot);

    function walk(node: BaseNode) {
      const foo: Editor.PluginEvent.IEventState = {
        type: node.type,
        state: node.State,
        children: []
      };

      node.getChildren().forEach((item) => {
        foo.children.push(walk(item as BaseNode));
      });

      return foo;
    }
    return root;
  }
}

export function isWithPropertyExp(node: WithTreeNode<Expression | PropertyExpression>): node is WithTreeNode<PropertyExpression> {
  return (node.FirstChild as PropertyExpression).type === 'PropertyExpression';
}
