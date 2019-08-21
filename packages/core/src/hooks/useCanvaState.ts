import * as React from 'react';
import { Context } from '../components/provider';
import { shallowEqual } from '../lib/tool';

export function useCanvaState<R>(mappedState: (state: Editor.ICanvaStoreState) => R) {
  const savedMappedState = React.useRef(mappedState);
  const context = React.useContext(Context);
  const [state, setState] = React.useState(savedMappedState.current(context.CanvaStore.State));
  const lastState = React.useRef(state);

  const updateState = React.useCallback(() => {
    const nextState = savedMappedState.current(context.CanvaStore.State);
    if (!shallowEqual(lastState.current, nextState)) {
      setState(nextState);
    }
    lastState.current = nextState;
  }, []);

  React.useEffect(() => {
    savedMappedState.current = mappedState;

    // mappedState改变了得重新计算一次state
    updateState();
  }, [mappedState]);

  React.useEffect(() => {
    updateState();

    // 绑定store更新
    context.CanvaStore.Store.subscribe(updateState);

    return () => {
      // 解绑store更新
      context.CanvaStore.Store.unSubscribe(updateState);
    };
  });

  return state;
}
