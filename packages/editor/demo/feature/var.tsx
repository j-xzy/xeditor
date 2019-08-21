import * as React from 'react';
import { VarComp } from '../../src';

export function Var(props: { name: string }) {
  return (
    <VarComp>
      <div style={{ border: '1px solid #000', height: '25px', width: '100px' }}>{props.name}</div>
    </VarComp>
  );
}
