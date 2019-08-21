import React from 'react';

export const context = React.createContext({});

export function Provider(props) {
  React.useEffect(()=> {
    props.store.done();
  }, []);
  return React.createElement(context.Provider, { value: props.store }, props.children);
}