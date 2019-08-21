import * as React from 'react';
import { Context, IStores } from '../components/provider';

export function pluginConnector<T, R>(pluginName: string) {
  return function Hoc(Component: React.ComponentClass<R> | React.StatelessComponent<R>) {
    return pluginControlAdvance<T, R>(pluginName, Component);
  };
}

function pluginControlAdvance<T, R>(pluginName: string, Component: React.ComponentClass<any> | React.StatelessComponent<any>): React.ComponentClass<T> {

  class PluginControl extends React.Component<R> {

    public static contextType = Context;
    public context!: IStores;

    constructor(props: R) {
      super(props);
      this.onStateChange = this.onStateChange.bind(this);
    }

    public componentDidMount() {
      const plugin = this.context.PluginControl.getPluginByName(pluginName);
      if (plugin) {
        plugin.subscribe(this.onStateChange);
      } else {
        // tslint:disable-next-line:no-console
        console.error(pluginName, ' 插件不存在!');
      }
    }

    public componentWillUnmount() {
      const plugin = this.context.PluginControl.getPluginByName(pluginName);
      if (plugin) {
        plugin.unSubscribe(this.onStateChange);
      }
    }

    public render() {
      return React.createElement(Component, this.getStateProps());
    }

    private getStateProps(): Readonly<R> {
      const plugin = this.context.PluginControl.getPluginByName(pluginName);
      const stateProps: any = {};
      Object.assign(stateProps, this.props);
      if (plugin) {
        Object.assign(stateProps, plugin.state());
      }
      return { ...stateProps } as Readonly<R>;
    }

    /** 响应store的state更改 */
    private onStateChange() {
      this.forceUpdate();
    }
  }

  return PluginControl as any;
}
