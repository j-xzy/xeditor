export class Plugin implements Editor.IPlugin {

  public pluginName: string = 'none';

  private listener: Array<(...params: any[]) => void> = [];

  constructor() {
    this.unSubscribe = this.unSubscribe.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.notify = this.notify.bind(this);
  }

  // 监听store的action
  public beforeDispatch(_action: Editor.IAction, _state: Readonly<any>) {
    //
  }

  // 监听store的action
  public afterDispatch(_action: Editor.IAction, _state: Readonly<any>) {
    //
  }

  // ＜Canvas /> 组件被挂载时
  public canvasDidMount() {
    //
  }

  // ＜Canvas /> 组件将被卸载时
  public canvasWillUnmount() {
    //
  }

  // 返回，在usePluginhook或pluginConnector中得到
  public state() {
    //
  }

  /** 添加监听 */
  public subscribe(listener: () => void) {
    this.listener.push(listener);
  }

  /** 解除监听 */
  public unSubscribe(listener: () => void) {
    const idx = this.listener.indexOf(listener);
    // tslint:disable-next-line:no-unused-expression
    idx >= 0 && this.listener.splice(idx, 1);
  }

  // 通知使用了usePluginhook或pluginConnector的组件
  protected notify() {
    this.listener.forEach((callback) => {
      callback();
    });
  }
}
