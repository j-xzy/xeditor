import * as React from 'react';
import { ApiComp } from '../../src';

export function Api(props: { name: string }) {
  return (
    <ApiComp>
      <div style={{ border: '1px solid #000', height: '25px', width: '100px' }}>{props.name}</div>
    </ApiComp>
  );
}
