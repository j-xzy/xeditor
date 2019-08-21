import * as React from 'react';
import { Context, IStores } from '../components/provider';

export function canvasConnector<T, R>(mapStateToProps: Editor.IMapCanvasStateToProps, mapDispatchToProps: Editor.IMapDispatchToProps) {
  return function Hoc(Component: Editor.ICanvasControlWrappedCompoent<R>) {
    return canvasControlAdvance<T, R>(Component, mapStateToProps, mapDispatchToProps);
  };
}

function canvasControlAdvance<T, R>(ComponentCls: Editor.ICanvasControlWrappedCompoent<R>, mapStateToProps: Editor.IMapCanvasStateToProps, mapDispatchToProps: Editor.IMapDispatchToProps): Editor.ICanvasControlComponentClass<T> {

  class CanvasControl extends React.Component<Editor.ICanvasControlComponentProps & R> {

    public static contextType = Context;
    public context!: IStores;

    constructor(props: Editor.ICanvasControlComponentProps & R) {
      super(props);

      this.onStateChange = this.onStateChange.bind(this);
    }

    public componentDidMount() {
      this.context.CanvaStore.Store.subscribe(this.onStateChange);
    }

    public componentWillUnmount() {
      this.context.CanvaStore.Store.unSubscribe(this.onStateChange);
    }

    public render() {
      return React.createElement(ComponentCls, this.getStateProps());
    }

    /** 响应store的state更改 */
    private onStateChange() {
      this.forceUpdate();
    }

    /** 得到store的state */
    private getStateProps(): R {
      const self = this;
      const stateProps = {};
      const dispatch = self.context.CanvaStore.Store.dispatch;

      Object.assign(stateProps, self.props);

      // 如果mapStateToProps存在
      if (typeof mapStateToProps !== 'undefined' && mapStateToProps != null) {
        // 执行mapStateToProps并将结果赋予stateProps
        Object.assign(stateProps, mapStateToProps(self.context.CanvaStore.State as any, self.props));
      }

      // 如果mapDispatchToProps存在
      if (typeof mapDispatchToProps !== 'undefined' && mapDispatchToProps != null) {
        // 如果是函数
        if (typeof mapDispatchToProps === 'function') {
          Object.assign(stateProps, mapDispatchToProps(dispatch, self.props));
        }

        // 如果是对象
        if (typeof mapDispatchToProps === 'object') {
          const dispatchProps: any = {};
          // tslint:disable-next-line:forin
          for (const key in mapDispatchToProps) {
            // tslint:disable-next-line:only-arrow-functions
            dispatchProps[key] = function() {
              dispatch(mapDispatchToProps[key].apply(self, arguments as any));
            };
          }
          Object.assign(stateProps, dispatchProps);
        }
      }
      return { ...stateProps } as R;
    }
  }

  return CanvasControl as any;
}
