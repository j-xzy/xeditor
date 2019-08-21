import * as React from 'react';
import { useFeatureSubsciber } from '../../interalHooks/useFeatureSubsciber';
import { parsePaddingShotCutAttr } from '../../lib/tool';
import { Context } from '../provider';

//#region style

const borderStyle: React.CSSProperties = {
  position: 'absolute',
  outline: '1px solid #3b97e3',
  pointerEvents: 'none'
};

const labelStyle: React.CSSProperties = {
  position: 'absolute',
  left: '0',
  top: '0',
  padding: '2px 5px',
  backgroundColor: '#3b97e3',
  color: '#fff',
  fontSize: '12px',
  outline: 'none',
  pointerEvents: 'none'
};

const paddingStyle: React.CSSProperties = {
  position: 'absolute',
  background: 'rgba(0, 255, 0, 0.2)'
};

const marginStyle: React.CSSProperties = {
  position: 'absolute',
  background: 'rgba(255, 178, 0, 0.2)'
};

const commonStyle: React.CSSProperties = {
  width: ' 100%',
  height: '100%',
  position: 'absolute'
};
//#endregion

export function Border() {
  // 监听featureStore的更改
  useFeatureSubsciber();

  const { CanvaStore, FeatureStore } = React.useContext(Context);

  const hoveredFeature = FeatureStore.HoverFeature;

  // hoveredFeature是否存在
  if (!hoveredFeature) {
    return null;
  }

  // 正在移动则不显示<Border />
  if (FeatureStore.IsMoving) {
    return null;
  }

  // hoverFeaute同时也是selectedFeature
  const hoverEqualSelected = hoveredFeature === FeatureStore.SelectedFeature;
  const isRoot = hoveredFeature === FeatureStore.Root;

  // 不是root节点且hover等于selected
  if (!isRoot && hoverEqualSelected) {
    return null;
  }

  const computedStyle = hoveredFeature.ComputedStyle;

  // 有可能为undefined,在字符串拼接时候会报错
  if (!computedStyle
    ||  computedStyle.padding === null
    ||  computedStyle.margin === null
    ||  computedStyle.width === null
    ||  computedStyle.height === null) {
    return null;
  }

  const bound = CanvaStore.getFeatureBoundingRectByCanvas(hoveredFeature);

  if (!bound) {
    return null;
  }
  const { width, height, padding, margin } = computedStyle;
  const formatPadding = parsePaddingShotCutAttr(padding);
  const formatMargin = parsePaddingShotCutAttr(margin);

  return (
    <div style={{ ...borderStyle, top: bound.top, left: bound.left, width, height }}>
      {renderPadding({ width, height }, { ...formatPadding })}
      {rednerMargin({ width, height }, { ...formatMargin })}
      <label style={labelStyle}>{hoveredFeature.Name}</label>
    </div >
  );

}

function renderPadding({ width, height }: Editor.ISize, { left, top, right, bottom }: Editor.IPadding) {
  return (
    <div style={commonStyle}>
      <div style={{ ...paddingStyle, top: 0, left: 0, width: parseFloat(width) - parseFloat(right) + 'px', height: top }}></div> */
       <div style={{ ...paddingStyle, top: 0, right: 0, width: right, height: parseFloat(height) - parseFloat(bottom) + 'px' }}></div> */
      <div style={{ ...paddingStyle, bottom: 0, right: 0, width: parseFloat(width) - parseFloat(left) + 'px', height: bottom }}></div>
      <div style={{ ...paddingStyle, bottom: 0, left: 0, width: left, height: parseFloat(height) - parseFloat(top) + 'px' }}></div>
    </div>
  );
}

function rednerMargin({ width, height }: Editor.ISize, { left, top, right, bottom }: Editor.IPadding) {
  return (
    <div style={commonStyle}>
      <div style={{ ...marginStyle, top: 0, left: '-' + left, width: left, height: stringAddition(height, bottom) + 'px' }}></div>
      <div style={{ ...marginStyle, bottom: '-' + bottom, left: 0, width: stringAddition(width, right) + 'px', height: bottom }}></div>
      <div style={{ ...marginStyle, bottom: 0, right: '-' + right, width: right, height: stringAddition(height, top) + 'px' }}></div>
      <div style={{ ...marginStyle, top: '-' + top, right: 0, width: stringAddition(width, left) + 'px', height: top }}></div>
    </div>
  );
}

function stringAddition(...str: string[]) {
  let result = 0;
  for (const item of str) {
    result += parseFloat(item);
  }
  return result;
}
