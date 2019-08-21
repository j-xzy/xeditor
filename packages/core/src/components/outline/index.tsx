import * as React from 'react';
import { useFeatureSubsciber } from '../../interalHooks/useFeatureSubsciber';
import { Context } from '../provider';

const style: React.CSSProperties = {
  position: 'absolute',
  outline: '2px solid #ffca6f',
  outlineOffset: '-2px'
};

export function Outline() {
  // 监听featureStore的更改
  useFeatureSubsciber();

  const { CanvaStore, FeatureStore } = React.useContext(Context);

  const dragEnterFeature = FeatureStore.DragEnterFeature;

  if (!dragEnterFeature) {
    return null;
  }

  const { SelectedFeature } = FeatureStore;

  if (SelectedFeature && typeof SelectedFeature.BaseStyle !== 'undefined') {
    // 移动时absolute、fixed不显示<Outline />
    if (SelectedFeature.BaseStyle.position === 'absolute'
      || SelectedFeature.BaseStyle.position === 'fixed'
    ) {
      return null;
    }
  }

  const computedStyle = dragEnterFeature.ComputedStyle;
  if (!computedStyle || computedStyle.width === null || computedStyle.height === null) {
    return null;
  }

  const bound = CanvaStore.getFeatureBoundingRectByCanvas(dragEnterFeature);

  if (!bound) {
    return null;
  }

  return (<div style={{ ...style, width: computedStyle.width, height: computedStyle.height, top: bound.top, left: bound.left }}></div>);
}
