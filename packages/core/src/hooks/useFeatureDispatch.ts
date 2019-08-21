import * as React from 'react';
import { Context } from '../components/provider';

export function useFeatureDispatch() {
  const context = React.useContext(Context);
  const dispatch = React.useCallback((action: Editor.IAction, ...params: any[]) => {
    if (context.FeatureStore.SelectedFeature) {
      context.FeatureStore.SelectedFeature.Store.dispatch(action, params);
    } else {
      // tslint:disable-next-line: no-console
      console.log('当前未有组件选中,不能调用dispatch');
    }
  }, []);
  return dispatch;
}
