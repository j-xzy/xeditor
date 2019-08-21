import * as React from 'react';
import { useLayer } from '../src';
import { Layer } from './components';

export function LayerWidget() {
  const layer = useLayer();
  return <Layer layer={layer} />;
}
