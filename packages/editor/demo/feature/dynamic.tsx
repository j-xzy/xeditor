import * as React from 'react';
import { DynamicFeature } from '../../src';

export function DynamicComp(props: { name: string, path: string }) {
  return (
    <DynamicFeature comPath={props.path} placeholder={<div style={{ background: 'red', width: '300px', height: '300px' }}>loading...</div>}>
      <div style={{ border: '1px solid #000', height: '25px', width: '100px' }}>{props.name}</div>
    </DynamicFeature>
  );
}
