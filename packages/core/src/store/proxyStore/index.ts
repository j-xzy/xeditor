/**
 * 代理dispatch
 */
import { injectable } from 'inversify';
import { Store } from '../store';

@injectable()
export class ProxyStore<T> extends Store<T> {
  constructor(reducer: Editor.IReducer<any>, private beforeDispatch: (action: Editor.IAction, state: Readonly<any>) => void, private afterDispatch: (action: Editor.IAction, state: Readonly<any>) => void) {
    super(reducer);
  }

  public dispatch(action: Editor.IAction, ...params: any[]) {
    this.beforeDispatch(action, this.getState());
    super.dispatch(action, ...params);
    this.afterDispatch(action, this.getState());
  }
}
