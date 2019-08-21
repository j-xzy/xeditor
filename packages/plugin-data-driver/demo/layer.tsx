import { Layer } from '@xeditor/layer';
import { useLayer } from '@xeditor/plugin-layer';
import * as React from 'react';

export function LayerWidget() {
  const layer = useLayer();
  return <Layer layer={layer} />;
}
