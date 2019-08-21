import { EvtEmitter } from 'evt-emit';
import * as React from 'react';
import { Context } from '../components/provider';
import { EventType } from '../lib/common';
import { debounce } from '../lib/tool';

export function controlConnector<T, R>(mapStateToProps: Editor.IMapStateToProps<any>, mapDispatchToProps: Editor.IMapDispatchToProps) {
  return function Hoc(ComponentCls: Editor.IControlWrappedCompoent<R>) {
    return controlAdvance<T, R>(ComponentCls, mapStateToProps, mapDispatchToProps);
  };
}

function controlAdvance<T, R>(ComponentCls: Editor.IControlWrappedCompoent<Readonly<R>>, mapStateToProps: Editor.IMapStateToProps<Editor.IFeatureState>, mapDispatchToProps: Editor.IMapDispatchToProps): Editor.IControlComponentClass<T> {

  class Control extends React.Component<R, {}> {

    public static contextType = Context;
    public context!: Editor.IStore<Editor.IFeatureState>;

    private store: Editor.IStore<Editor.IFeatureState> | null = null;

    constructor(props: R) {
      super(props);
      this.onStateChange = debounce(this.onStateChange.bind(this), 0);
      this.onSwitchStore = this.onSwitchStore.bind(this);
      this.unSubscribeLastStore = this.unSubscribeLastStore.bind(this);

      // 不能在didmounted中绑定事件
      // 绑定切换Store事件
      EvtEmitter.Instance.subscribe(EventType.SwitchStore, this.onSwitchStore);

      // 绑定解除store绑定
      EvtEmitter.Instance.subscribe(EventType.UnSubscribeStore, this.unSubscribeLastStore);
    }

    //#region lifecycle
    public render() {
      return React.createElement(ComponentCls, this.getStateProps());
    }

    public componentDidMount() {
      // 初始绑定store
      if (this.context.FeatureStore.SelectedFeature) {
        this.subscribeStore(this.context.FeatureStore.SelectedFeature.Store);
        this.onStateChange();
      }
    }

    public componentWillUnmount() {
      // 卸载监听
      EvtEmitter.Instance.unSubscribe(EventType.SwitchStore, this.onSwitchStore);
      EvtEmitter.Instance.unSubscribe(EventType.UnSubscribeStore, this.unSubscribeLastStore);

      if (this.store) {
        this.store.unSubscribe(this.onStateChange);
      }
    }
    //#endregion

    /** 得到store的state */
    private getStateProps(): Readonly<R> {
      // store不存在则返回props
      if (!this.store) {
        return this.props;
      }

      const stateProps = {};

      // 绑定dispatch的作用域（store）
      const dispatch = this.store.dispatch.bind(this.store);

      // 将props赋予stateProps
      Object.assign(stateProps, this.props);

      // 如果mapStateToProps存在
      if (typeof mapStateToProps !== 'undefined' && mapStateToProps != null) {
        // 执行mapStateToProps并将结果赋予stateProps
        Object.assign(stateProps, mapStateToProps(this.store.getState(), this.props));
      }

      // 如果mapDispatchToProps存在
      if (typeof mapDispatchToProps !== 'undefined' && mapDispatchToProps != null) {
        // 如果是函数
        if (typeof mapDispatchToProps === 'function') {
          Object.assign(stateProps, mapDispatchToProps(dispatch, this.props));
        }

        // 如果是对象
        if (typeof mapDispatchToProps === 'object') {
          const dispatchProps: any = {};
          // tslint:disable-next-line:forin
          for (const key in mapDispatchToProps) {
            dispatchProps[key] = function() {
              dispatch(mapDispatchToProps[key].apply(this, arguments as any));
            };
          }
          Object.assign(stateProps, dispatchProps);
        }
      }
      return { ...stateProps } as Readonly<R>;
    }

    /**
     * 响应store的切换
     * @param store
     */
    private onSwitchStore(store: Editor.IStore<Editor.IFeatureState> | null) {
      // 取消上一个store的监听
      this.unSubscribeLastStore();

      // 监听此时的store
      this.subscribeStore(store);

      // 更新组件
      this.onStateChange();
    }

    /** 响应store的state更改 */
    private onStateChange() {
      this.forceUpdate();
    }

    /** 监听store的更改 */
    private subscribeStore(store: Editor.IStore<Editor.IFeatureState> | null) {
      this.store = store;
      if (this.store) {
        this.store.subscribe(this.onStateChange);
      }
    }

    /** 解除之前的监听 */
    private unSubscribeLastStore() {
      // 如果store存在
      if (this.store) {
        // 移除监听
        this.store.unSubscribe(this.onStateChange);
      }
      this.store = null;

      // 更新组件以刷新 stateProps，避免<Control />还会更改组件
      this.onStateChange();
    }
  }

  return Control as any;
}
