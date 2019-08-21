import * as React from 'react';
import { useFeatureSubsciber } from '../../interalHooks/useFeatureSubsciber';
import { parsePaddingShotCutAttr } from '../../lib/tool';
import { Context } from '../provider';

const outerStyle: React.CSSProperties = {
  position: 'absolute',
  zIndex: 10,
  borderStyle: 'solid',
  outline: 'none',
  transition: 'top .2s,left .2s,width .2s,height .2s'
};

const innerStyle: React.CSSProperties = {
  backgroundColor: '#62c462',
  boxShadow: '0 0 3px rgba(0,0,0,0.2)',
  padding: '1.5px',
  outline: 'none'
};

export function Placeholder() {
  // 监听featureStore的更改
  useFeatureSubsciber();

  const { CanvaStore, FeatureStore } = React.useContext(Context);

  // 当前没有DragEnterFeature
  if (FeatureStore.DragEnterFeature === null) {
    return null;
  }

  // 移动时absolute、fixed不显示<Placeholder />
  if (FeatureStore.IsMoving && FeatureStore.SelectedFeature
    &&
    (typeof FeatureStore.SelectedFeature.BaseStyle === 'undefined'
      || FeatureStore.SelectedFeature.BaseStyle.position === 'absolute'
      || FeatureStore.SelectedFeature!.BaseStyle.position === 'fixed')
  ) {
    return null;
  }

  // 没有待插入的目标节点
  if (!FeatureStore.InsertedAimsFeature) {
    return null;
  }

  const { feature, method } = FeatureStore.InsertedAimsFeature;

  // feature 不存在
  if (!feature) {
    return null;
  }

  if (!feature.HasDom) {
    return null;
  }

  const rect = CanvaStore.getFeatureBoundingRectByCanvas(feature);

  if (!rect) {
    return null;
  }

  const baseStyle = feature.BaseStyle;
  if (typeof baseStyle === 'undefined' || typeof baseStyle.display === 'undefined' || typeof baseStyle.margin === 'undefined') {
    return null;
  }

  const inFlow = baseStyle.display === 'block' && baseStyle.float === 'none';

  if (!feature.ComputedStyle || feature.ComputedStyle.margin === null) {
    return null;
  }

  const margin = parsePaddingShotCutAttr(feature.ComputedStyle.margin);

  // tslint:disable-next-line:one-variable-per-declaration
  let top = rect.top, left = rect.left, borderColor = '', offsetMargin = '0';
  // tslint:disable-next-line:one-variable-per-declaration
  let height: string | number = 'auto', width: string | number = 'auto';
  // tslint:disable-next-line:one-variable-per-declaration
  let iWidth: string | number = 'auto', iHeight: string | number = 'auto';

  if (inFlow) {
    borderColor = 'transparent rgb(98, 196, 98)';
    width = rect.width;
    iWidth = rect.width - 6;
    offsetMargin = '3px 0px 0px';

    if (method === 'predecessor') {
      top = rect.top - parseFloat(margin.top);
    }

    if (method === 'successor') {
      top = rect.top + rect.height;
    }

  } else {
    borderColor = 'rgb(98, 196, 98) transparent';
    height = rect.height;
    iHeight = rect.height - 6;
    offsetMargin = '0px 0px 0px -3px';

    if (method === 'predecessor') {
      left = rect.left;
    }

    if (method === 'successor') {
      left = rect.left + rect.width;
    }
  }

  const style = { top, left, height, width, borderColor, margin: offsetMargin };
  return (
    <div style={{ ...outerStyle, ...style }}>
      <div style={{ ...innerStyle, width: iWidth, height: iHeight }}></div>
    </div>
  );
}
