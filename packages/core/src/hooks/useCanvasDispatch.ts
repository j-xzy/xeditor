import * as React from 'react';
import { Context } from '../components/provider';

export function useCanvasDispatch() {
  const context = React.useContext(Context);

  return context.CanvaStore.Store.dispatch;
}
