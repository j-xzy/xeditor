import React from 'react';
import { context } from './provider';

export function useStore(dep = []) {
  const store = React.useContext(context);
  const [, forceUpdate] = React.useState({});
  const emit = React.useCallback((namespace, type, data) => {
    store.dispatch({ type: `${namespace}/${type}`, data });
  });

  React.useEffect(() => {
    const update = (id) => {
      if (dep.findIndex((v) => v==id) > -1) {
        forceUpdate({});
      }
    };
    const unSubscribe = store.subscribe(update);
    return () => unSubscribe();
  }, []);

  return { state: store.getState(), emit };
}