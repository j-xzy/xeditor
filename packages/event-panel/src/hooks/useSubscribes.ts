import { BaseNode } from '@xeditor/plugin-event';
import * as React from 'react';

export function useSubscribes(nodes: BaseNode[]) {
  const [, forceupdate] = React.useState({});
  React.useEffect(() => {
    const updata = () => forceupdate({});
    nodes.forEach((node) => node.subscribe(updata));
    return () => {
      nodes.forEach((node) => node.unSubscribe(updata));
    };
  });
}
