// tslint:disable:no-shadowed-variable
import { EvtEmitter } from 'evt-emit';
import * as React from 'react';
import { useFeatureSubsciber } from '../../interalHooks/useFeatureSubsciber';
import { EventType } from '../../lib/common';
import { Context } from '../provider';

const toolbarWidth = 80;
const style: React.CSSProperties = {
  position: 'absolute',
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  height: '22px',
  width: toolbarWidth,
  pointerEvents: 'all',
  backgroundColor: '#3b97e3'
};

export function ToolBar() {
  // 监听featureStore的更改
  useFeatureSubsciber();

  const { CanvaStore, FeatureStore } = React.useContext(Context);

  function handleMoveMouseDown(e: React.MouseEvent<SVGElement>) {
    e.stopPropagation();
    const selectedFeature = FeatureStore.SelectedFeature;

    if (!selectedFeature || !selectedFeature.ComputedStyle) {
      return;
    }

    const baseStyle = selectedFeature.BaseStyle;
    if (typeof baseStyle === 'undefined' || typeof baseStyle.width === 'undefined' || typeof baseStyle.height === 'undefined') {
      return null;
    }

    const { left, top } = selectedFeature.ComputedStyle;

    CanvaStore.setMouseDonwPosition({
      x: e.clientX,
      y: e.clientY
    });

    CanvaStore.setFeatureSnapShot({
      x: parseFloat(left as string),
      y: parseFloat(top as string),
      width: baseStyle.width,
      height: baseStyle.height
    });

    FeatureStore.updateIsMoving(true);
  }

  function handleMoveMouseUp() {
    FeatureStore.updateIsMoving(false);
    FeatureStore.updateDragEnterFeature(null);
  }

  function handleCopyClick() {
    CanvaStore.copySelectedFtrAndInsert();
    EvtEmitter.Instance.emit(EventType.RenderCanvas, true);
  }

  function handleDustBinClick() {
    const selectedFeature = FeatureStore.SelectedFeature;
    FeatureStore.removeNode(selectedFeature!);
    FeatureStore.updateSelectedFeature(null);
    // 更新 canvas
    EvtEmitter.Instance.emit(EventType.RenderCanvas, true);
  }

  // 是否是元素选中
  if (!FeatureStore.SelectedFeature) {
    return null;
  }

  // 选中的元素是否有Toolbar选项
  if (!FeatureStore.SelectedFeature.Toolbar) {
    return null;
  }
  // tslint:disable-next-line:prefer-const
  let bound = CanvaStore.getFeatureBoundingRectByCanvas(FeatureStore.SelectedFeature);

  if (!bound) {
    return null;
  }

  // tslint:disable-next-line:prefer-const
  let { left, top } = bound;

  // 因为BaseStyle更新了，本组件才会刷新，同时带动top、left
  const computedStyle = FeatureStore.SelectedFeature.ComputedStyle;
  if (!computedStyle || typeof computedStyle.width === 'undefined' || computedStyle.width === null) {
    return null;
  }
  left = left + parseFloat(computedStyle.width) - toolbarWidth - 6;
  top = top - 21;
  return (
    <div style={{ ...style, left, top }} onMouseUp={(e) => e.stopPropagation()}>
      <Move onMouseDown={handleMoveMouseDown} onMouseUp={handleMoveMouseUp} />
      <Copy onClick={handleCopyClick} />
      <DustBin onClick={handleDustBinClick} />
    </div>
  );
}

function DustBin({ onClick }: { onClick: () => void }) {
  return (
    <svg onClick={onClick} style={{ cursor: 'pointer' }} viewBox='0 0 1024 1024' width='15' height='15'>
      <path d='M385 156c-14.912 0-27-12.088-27-27L358 63c-0.004-5.065 1.164-22.021 15.808-37.166C388.458 10.683 410.899 3 440.507 3l152.162 0 1.179 0.104c1.565 0.138 15.714 1.511 30.324 7.289C649.483 20.402 664 39.212 664 62l0 66c0 14.912-12.088 27-27 27s-27-12.088-27-27L610 63.531c-3.27-2.581-12.425-5.604-19.969-6.531L440.507 57c-20.752 0-27.526 5.375-28.507 7.189L412 129C412 143.912 399.912 156 385 156z' p-id='1424' fill='#ffffff' />
      <path d='M990 263 35 263c-17.673 0-32-14.327-32-32s14.327-32 32-32l955 0c17.673 0 32 14.327 32 32S1007.673 263 990 263z' p-id='1425' fill='#ffffff' />
      <path d='M790 1024 230.048 1024l-1.938-0.237c-3.197-0.392-20.021-2.881-37.32-13.472C165.131 994.581 151 968.907 151 938L151 246c0-17.673 14.327-32 32-32s32 14.327 32 32l0 692c0 10.111 3.92 14.161 8.157 17.031 4.123 2.793 8.994 4.331 11.713 4.969L790 960c8.359 0 14.558-2.268 18.947-6.932 0.777-0.826 1.479-1.724 2.053-2.523L811 235c0-17.673 14.327-32 32-32s32 14.327 32 32l0 728.048-1.554 4.803c-0.829 2.562-5.588 16.006-17.894 29.081C843.931 1009.28 823.123 1024 790 1024z' p-id='1426' fill='#ffffff' />
      <path d='M384 841c-14.912 0-27-12.088-27-27L357 414c0-14.912 12.088-27 27-27s27 12.088 27 27l0 400C411 828.912 398.912 841 384 841z' p-id='1427' fill='#ffffff' /><path d='M639 841c-14.912 0-27-12.088-27-27L612 414c0-14.912 12.088-27 27-27s27 12.088 27 27l0 400C666 828.912 653.912 841 639 841z' p-id='1428' fill='#ffffff' />
    </svg>
  );
}

function Copy({ onClick }: { onClick: () => void }) {
  return (
    <svg onClick={onClick} style={{ cursor: 'pointer' }} viewBox='0 0 1024 1024' width='16' height='16'>
      <path d='M640 341.333333H128a42.666667 42.666667 0 0 0-42.666667 42.666667v512a42.666667 42.666667 0 0 0 42.666667 42.666667h512a42.666667 42.666667 0 0 0 42.666667-42.666667V384a42.666667 42.666667 0 0 0-42.666667-42.666667z m-42.666667 512H170.666667V426.666667h426.666666v426.666666z' fill='#fff' p-id='2656'></path>
      <path d='M896 85.333333H384a42.666667 42.666667 0 0 0-42.666667 42.666667v128h85.333334V170.666667h426.666666v426.666666h-85.333333v85.333334h128a42.666667 42.666667 0 0 0 42.666667-42.666667V128a42.666667 42.666667 0 0 0-42.666667-42.666667z' fill='#fff' p-id='2657'></path>
    </svg>
  );
}

function Move({ onMouseDown, onMouseUp }: { onMouseDown: (e: React.MouseEvent<SVGElement>) => void, onMouseUp: (e: React.MouseEvent<SVGElement>) => void }) {
  return (
    <svg onMouseDown={onMouseDown} onMouseUp={onMouseUp} style={{ cursor: 'pointer' }} viewBox='0 0 1024 1024' width='16' height='16'>
      <path d='M768 469.333333h-213.333333V256h128l-170.666667-170.666667-170.666667 170.666667h128v213.333333H256V341.333333l-170.666667 170.666667 170.666667 170.666667v-128h213.333333v213.333333H341.333333l170.666667 170.666667 170.666667-170.666667h-128v-213.333333h213.333333v128l170.666667-170.666667-170.666667-170.666667z' fill='#ffffff' p-id='3316' />
    </svg>
  );
}
