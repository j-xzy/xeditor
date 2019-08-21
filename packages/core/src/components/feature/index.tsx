import { EvtEmitter } from 'evt-emit';
import * as React from 'react';
import { DropTarget, DropTargetConnector, DropTargetMonitor } from 'react-dnd';
import { DROP_TARGET_PREVIEW } from '../../lib/common';
import { EventType } from '../../lib/common';
import { throwIfCompositeComponentElement } from '../../lib/tool';
import { Context, IStores } from '../provider';

/**
 * 创建featureComponent
 * @param _WrappedFeatureComponentClass 被包裹的组件
 * @returns FeatureComponent
 */
export function featureAdvance(_WrappedFeatureComponentClass: Editor.IWrappedFeatureComponentClassOrFunc): Editor.IFeatureComponentClass {

  const dropTarget = {
    drop(_props: Editor.IFeatureComponentProps, monitor: DropTargetMonitor, component: FeatureComponent) {
      // 已经被其它嵌套的feature处理过，返回
      if (monitor.didDrop()) {
        return;
      }

      const { WrappedFeatureComponentClassOrFunc: NestingWrappedFeatureComponentClass,
        reducer, option, props: previewProps } = monitor.getItem() as Editor.IBeginDragResult;

      // 添加featureCompoent
      component.addFeature(option, reducer, previewProps, NestingWrappedFeatureComponentClass);
    },
    hover(props: Editor.IFeatureComponentProps, monitor: DropTargetMonitor, component: FeatureComponent) {
      const { option } = monitor.getItem() as Editor.IBeginDragResult;
      if (option.group !== '画布') {
        // 是隐藏元素
        const ftrStore = component.context.FeatureStore;
        return ftrStore.updateDragEnterFeature(ftrStore.Root as Editor.IFeature);
      }

      // 不是正当前的feature，返回
      if (!monitor.isOver({ shallow: true })) {
        return;
      }

      // 更新当前进入的元素
      component.context.FeatureStore!.updateDragEnterFeature(props.feature);
    }
  };

  function collect(connect: DropTargetConnector, monitor: DropTargetMonitor) {
    return {
      connectDropTarget: connect.dropTarget(),
      isCurrOver: monitor.isOver({ shallow: true })
    };
  }

  class FeatureComponent extends React.Component<Editor.IFeatureComponentProps, Editor.IFeatureComponentState> implements Editor.IFeatureComponent {

    public static contextType = Context;

    public static getDerivedStateFromError() {
      return {};
    }

    public context!: IStores;

    private feature: Editor.IFeature;
    private domRef: React.RefObject<HTMLElement> = React.createRef();

    constructor(props: Editor.IFeatureComponentProps) {
      super(props);
      this.handleMouseOver = this.handleMouseOver.bind(this);
      this.handleClick = this.handleClick.bind(this);
      this.appendChildFeatures = this.appendChildFeatures.bind(this);
      this.connect = this.connect.bind(this);
      this.replace = this.replace.bind(this);
      this.remove = this.remove.bind(this);
      this.onStoreChange = this.onStoreChange.bind(this);

      this.feature = this.props.feature;

      // 绑定store
      this.feature.Store.subscribe(this.onStoreChange);
    }

    //#region lifeCycle
    public render() {
      return (
        <_WrappedFeatureComponentClass
          replace={this.replace}
          connect={this.connect}
          remove={this.remove}
          {...this.feature.OwnProps}
          {...this.feature.State}
          appendChildFeatures={this.appendChildFeatures}>
          {this.props.children}
        </_WrappedFeatureComponentClass>
      );
    }

    // 错误处理，回退
    public componentDidCatch() {
      // 最后一次添加的feature存在
      if (this.context.CanvaStore.LastFeature) {
        this.context.CanvaStore.LastFeature.Error = true;

        // 将未发生错误的root插入根节点
        this.context.FeatureStore.insertAsRoot(this.context.FeatureStore.copy(this.context.CanvaStore.getSnapshop().feature));

        // // 重新渲染,不记录此次历史
        EvtEmitter.Instance.emit(EventType.RenderCanvas, false);

        // // 通知Error
        EvtEmitter.Instance.emit(EventType.Error, '渲染组件失败');
      }
    }

    public componentDidMount() {
      // 在feature对象中保存真实dom
      this.feature.setDom(this.domRef.current!);

      // 是否需要更新<Resizer /> <Toolbar />
      if (this.feature.NeededUpDateTool) {
        // 更新<Resizer /> <Toolbar />
        this.context.FeatureStore.refreshTools();
        this.feature.NeededUpDateTool = false;
      }

      // 在真实dom上添加事件监听
      if (this.domRef.current) {
        this.domRef.current.addEventListener('click', this.handleClick);
        this.domRef.current.addEventListener('mouseover', this.handleMouseOver);
      }

      // 若是容器组件则绑定drag的drop、hover事件
      if (this.feature.Container) {
        this.props.connectDropTarget(this.domRef.current);
      }
    }

    public componentWillUnmount() {
      this.feature.setDom(null);

      // 移除监听
      if (this.domRef.current) {
        this.domRef.current.removeEventListener('click', this.handleClick);
        this.domRef.current.removeEventListener('mouseover', this.handleMouseOver);
      }

      this.feature.Store.unSubscribe(this.onStoreChange);
    }

    public componentDidUpdate() {
      // this.feature 和　this.context.FeatureStore.SeletedFeature可能不一样,以下两种情况
      // 1.组件的宽高等属性改变时一致
      // 2.组件移动位置时候,this.feature为父组件,this.context.FeatureStore.SeletedFeature为被移动的组件
      if (!this.context.FeatureStore.SelectedFeature) {
        // 没有选中组件
        return;
      }

      if (!this.context.FeatureStore.SelectedFeature.HasDom) {
        // 没有dom,因为元素可能unmounted了
        // 设置标示，待其didmounted触发PositionMayChange事件更新<Resizer /> <Toolbar />
        this.context.FeatureStore.SelectedFeature.NeededUpDateTool = true;
        return;
      }

      // 更新<Resizer /> <Toolbar />
      this.context.FeatureStore.refreshTools();
    }
    //#endregion

    /** 增加新的feature到canvas */
    public addFeature(option: Editor.IFeatureOption, reducer: Editor.IReducer<Editor.IFeatureState>, previewProps: any, NestingWrappedFeatureComponentClass?: Editor.IWrappedFeatureComponentClassOrFunc) {
      this.context.CanvaStore.addFeature(option, reducer, previewProps, NestingWrappedFeatureComponentClass);

      // 更新 canvas
      EvtEmitter.Instance.emit(EventType.RenderCanvas, option.history);
    }

    //#region event
    private handleClick(e: MouseEvent) {
      e.stopPropagation();
      // 更改当前选中的feature
      this.context.FeatureStore.updateSelectedFeature(this.props.feature);
    }

    private handleMouseOver(e: MouseEvent) {

      // 更新hoverFeature以更改<Border />
      this.updateHoverFeatureWhileMousemove(e);

      // 更新dragEnterFeature move时才会更改位子
      this.updateDragEnterFeatureWhileMove(e);
    }
    //#endregion

    /** 更改hoverFeature以更改<Border /> */
    private updateHoverFeatureWhileMousemove(e: MouseEvent) {
      // 没有移动时，停止冒泡，解决只显示顶层组件的<Border />
      if (!this.context.FeatureStore.IsMoving) {
        e.stopPropagation();
      }

      // 正在移动,不显示 <Border />
      if (this.context.FeatureStore.IsMoving) {
        this.context.FeatureStore.updateHoverFeature(null);
        return;
      }

      // 正在改变大小,不显示 <Border />
      if (this.context.CanvaStore.ResizingType !== 'none') {
        return;
      }

      // 更改当前hoverFeature,显示对应<Border />
      this.context.FeatureStore.updateHoverFeature(this.feature);
    }

    /** 更改dragEnterFeature以更改placeholder */
    private updateDragEnterFeatureWhileMove(e: MouseEvent) {
      if (!this.context.FeatureStore.IsMoving) {
        return;
      }

      // 移动时，若是container容器则停止冒泡,可以找准DragEnterFeature
      if (this.feature.Container) {
        e.stopPropagation();
      }

      // 进入的容器不是container容器则返回
      if (!this.feature.Container) {
        return;
      }

      this.context.FeatureStore.updateDragEnterFeature(this.feature);
    }

    /** 添加此feature的孩子节点 */
    private appendChildFeatures: Editor.IAppendChildFeatures = (features: Array<{ option: Editor.IFeatureOption, reducer: Editor.IReducer<Editor.IFeatureState>, component: Editor.IWrappedFeatureComponentClassOrFunc, props: any }>) => {
      // 如果是被copy的，就不再重复添加child
      if (this.feature.IsCopy) {
        return;
      }

      features.forEach(({ option, reducer, component, props }) => {
        const childFeature = this.context.FeatureStore.createFeature(
          option,
          reducer,
          props,
          featureAdvance(component)
        );

        // 设置store的id
        this.context.CanvaStore.increaseFeatureStoreId(childFeature);

        this.context.FeatureStore.appendChild(this.feature, childFeature);
      });

      // 记录最后一次添加的feature
      this.context.CanvaStore.LastFeature = this.feature;

      // 更新<Canvas />
      // 孩子节点纪录历史
      this.context.CanvaStore.Store.dispatch({ type: 'appendChildFeatures', data: null });
    }

    /** 得到wrapped的dom */
    private connect: Editor.IConnect = (element: JSX.Element) => {
      throwIfCompositeComponentElement(element);

      return React.cloneElement(element, {
        ref: this.domRef
      });
    }

    /** 替换feature */
    private replace: Editor.IReplace = (option: Editor.IFeatureOption, reducer: Editor.IReducer<Editor.IFeatureState>, previewProps: any, NestingWrappedFeatureComponentClass: Editor.IWrappedFeatureComponentClassOrFunc, newStoreId = true, dispatchDelete = true) => {
      // 创建feature
      const feature = this.context.FeatureStore.createFeature(
        option,
        reducer,
        previewProps,
        featureAdvance(NestingWrappedFeatureComponentClass)
      );

      if (newStoreId) {
        // 新的store.state.id
        this.context.CanvaStore.increaseFeatureStoreId(feature);
      } else {
        feature.State = { ...feature.State, id: this.feature.State.id };
      }

      if (dispatchDelete) {
        this.context.FeatureStore.replaceNode(this.feature, feature);
      } else {
        this.context.FeatureStore.replaceNodeNoDispatchDelete(this.feature, feature);
      }

      // 更新 canvas
      EvtEmitter.Instance.emit(EventType.RenderCanvas, feature.Option.history);
    }

    /** 移除此feature */
    private remove() {
      this.context.FeatureStore.removeNode(this.feature);
      if (this.feature === this.context.FeatureStore.SelectedFeature) {
        this.context.FeatureStore.updateSelectedFeature(null);
      }
      EvtEmitter.Instance.emit(EventType.RenderCanvas);
    }

    private onStoreChange() {
      this.context.CanvaStore.takeSnapshot();
      // store中state的改变使视图刷新
      this.forceUpdate();
    }
  }

  /** 注入CanvaStore和FeatureStore */
  return DropTarget<Editor.IFeatureComponentProps, ReturnType<typeof collect>>(DROP_TARGET_PREVIEW, dropTarget, collect)(FeatureComponent);
}
