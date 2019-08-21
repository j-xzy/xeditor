import * as React from 'react';
import { Context } from '../components/provider';

export function usePlugin(pluginName: string) {
  const [, forceUpdate] = React.useState({});
  const { PluginControl } = React.useContext(Context);
  const plugin = PluginControl.getPluginByName(pluginName);

  React.useEffect(() => {
    function update() {
      forceUpdate({});
    }
    if (plugin) {
      plugin.subscribe(update);
    }
    return () => {
      if (plugin) {
        plugin.unSubscribe(update);
      }
    };
  });

  if (plugin) {
    return plugin.state();
  }
  // tslint:disable-next-line:no-console
  console.error(pluginName, ' 插件不存在!');
}
