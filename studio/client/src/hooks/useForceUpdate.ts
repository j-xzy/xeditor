import * as React from 'react';

export function useForceUpdate() {
  const [, forceUpdate] = React.useState({});
  return () => forceUpdate({});
}
