import * as React from 'react';
import { useFeatureSubsciber } from '../../interalHooks/useFeatureSubsciber';
import { Context } from '../provider';

const style: React.CSSProperties = {
  position: 'absolute',
  background: 'rgba(255,255,255,0.5)'
};

export function Shade() {
  // 监听featureStore的更改
  useFeatureSubsciber();

  const { FeatureStore, CanvaStore } = React.useContext(Context);

  // 当前正在移动
  if (!FeatureStore.IsMoving) {
    return null;
  }

  // 有元素被选中
  if (!FeatureStore.SelectedFeature) {
    return null;
  }

  const computedStyle = FeatureStore.SelectedFeature.ComputedStyle;
  if (!computedStyle || computedStyle.width === null || computedStyle.height === null) {
    return null;
  }

  const bound = CanvaStore.getFeatureBoundingRectByCanvas(FeatureStore.SelectedFeature);
  if (!bound) {
    return null;
  }

  return (<div style={{ width: computedStyle.width, height: computedStyle.height, left: bound.left, top: bound.top, ...style }}></div>);
}
