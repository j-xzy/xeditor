import * as React from 'react';
import { Context } from '../components/provider';

// 监听featureStore的更改
export function useFeatureSubsciber() {
  const context = React.useContext(Context);
  const [, forceUpdate] = React.useState({});

  React.useEffect(() => {
    const updateComp = () => forceUpdate({});
    context.FeatureStore.Store.subscribe(updateComp);

    return () => context.FeatureStore.Store.unSubscribe(updateComp);
  }, []);
}
