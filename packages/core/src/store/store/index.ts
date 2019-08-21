import { injectable } from 'inversify';

export const COPY = '__copy';

@injectable()
export class Store<T> implements Editor.IStore<T> {

  private readonly reducer: Editor.IReducer<T>;
  private curState: any;
  private listener: Array<(...params: any[]) => void> = [];

  constructor(reducer: Editor.IReducer<T>) {
    this.reducer = reducer;
    this.curState = reducer({ type: '__init', data: null });
    this.dispatch = this.dispatch.bind(this);
  }

  public get Reducer() {
    return this.reducer;
  }

  /** 得到state */
  public getState() {
    return this.curState;
  }

  /** 清空监听 */
  public clear() {
    this.listener = [];
  }

  /** 添加监听 */
  public subscribe(listener: () => void) {
    this.listener.push(listener);
    return () => this.unSubscribe(listener);
  }

  /** 解除监听 */
  public unSubscribe(listener: () => void) {
    const idx = this.listener.indexOf(listener);
    // tslint:disable-next-line:no-unused-expression
    idx >= 0 && this.listener.splice(idx, 1);
  }

  /** dispatch */
  public dispatch(action: Editor.IAction, ...params: any[]) {
    if (action.type === COPY) {
      this.curState = action.data;
    } else {
      this.curState = this.reducer(action, this.curState);
    }
    this.listener.forEach((callback) => {
      callback(...params);
    });
  }
}
