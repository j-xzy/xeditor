import { util } from '@xeditor/core';
import * as React from 'react';

export function useFtrSubscribe(features: Editor.IFeature[]) {
  const [, forceUpdate] = React.useState({});
  React.useEffect(() => {
    const update = util.debounce(() => forceUpdate({}), 300);
    features.forEach((ftr) => ftr.Store.subscribe(update));
    return () => features.forEach((ftr) => ftr.Store.unSubscribe(update));
  });
}
