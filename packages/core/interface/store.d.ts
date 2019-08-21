declare namespace Editor {
  interface IStore<T> {

    /**
     * 得到reducer函数
     */
    Reducer: IReducer<T>;

    /**
     * 得到数据
     */
    getState(): T;

    /**
     * 添加监听
     * @param listener 
     */
    subscribe(listener: () => void): () => void;

    /**
     * 移除监听
     * @param listener 
     */
    unSubscribe(listener: () => void): void;

    /**
     * 清空监听
     */
    clear(): void;

    /**
     * 
     * @param action 
     * @param params 参数
     */
    dispatch(action: IAction, ...params: any[]): void;

    [p: string]: any;
  }

  interface IAction {
    type: any;
    data: any;
  }

  interface IReducer<T> {
    (action: IAction, currState?: T): T;
  }

  interface IDispatch {
    ({ type, data }: { type: string, data: any }): void;
  }

  interface IMapStateToProps<T> {
    (state: T, ownProps: any): any;
  }

  type IMapDispatchToProps = IMapDispatchToPropsObj | IMapDispatchToPropsFunc;

  interface IMapDispatchToPropsObj {
    [p: string]: (...p: any[]) => any;
  }

  interface IMapDispatchToPropsFunc {
    (dispatch: IDispatch, ownProps: any): any;
  }

  interface ICreateProxyStore<T> {
    (reducer: IReducer<T>, currState?: Readonly<T>): IStore<T>;
  }
}