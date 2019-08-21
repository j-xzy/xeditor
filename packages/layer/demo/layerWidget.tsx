import { useLayer } from '@xeditor/plugin-layer';
import * as React from 'react';
import { Layer } from '../src';

export function LayerWidget() {
  const layer = useLayer();
  return <Layer layer={layer} />;
}
