import * as React from 'react';
import { useFeatureSubsciber } from '../../interalHooks/useFeatureSubsciber';
import { isPx } from '../../lib/tool';
import { Context } from '../provider';

//#region style
const toolStyle: React.CSSProperties = {
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  pointerEvents: 'none',
  outline: '3px solid #3b97e3',
  outlineOffset: '-2px',
  zIndex: 1000
};

const toolRowStyle: React.CSSProperties = {
  position: 'relative'
};

const toolItemStyle: React.CSSProperties = {
  position: 'absolute',
  border: '3px solid #3b97e3',
  width: '13px',
  height: '13px',
  backgroundColor: '#fff',
  pointerEvents: 'all'
};
//#endregion

export function Resizer() {
  // 监听featureStore的更改
  useFeatureSubsciber();

  const { FeatureStore, CanvaStore } = React.useContext(Context);

  function handleMouseDown(e: React.MouseEvent<HTMLElement>, type: Editor.IResizingType) {
    // 设hoverFeaute为null以不显示<Border />
    FeatureStore.updateHoverFeature(null);

    // 设置对应的resizeType（上下左右...）
    CanvaStore.setResizingType(type, {
      x: e.clientX,
      y: e.clientY
    });
  }

  // 当前没有feature被选中
  if (FeatureStore.SelectedFeature === null) {
    return null;
  }

  // 选中的为root
  if (FeatureStore.SelectedFeature === FeatureStore.Root) {
    return null;
  }

  const status = CanvaStore.ResizerStatus;
  const baseStyle = FeatureStore.SelectedFeature.BaseStyle;

  if (!status || !baseStyle) {
    return null;
  }

  const { size, position } = status;
  const isHeightPx = isPx(baseStyle.height);
  const isWidthPx = isPx(baseStyle.width);

  return (
    <div style={{ ...toolStyle, ...size, ...position }}>
      <div style={{ ...toolRowStyle, top: '-8px' }}  >
        {
          FeatureStore.SelectedFeature.Resizer &&
          <>
            {
              isHeightPx && isWidthPx &&
              <i style={{ ...toolItemStyle, left: '-5px', cursor: 'nwse-resize' }} onMouseDown={(e) => handleMouseDown(e, 'topLeft')} />
            }
            {
              isHeightPx &&
              <i style={{ ...toolItemStyle, left: 'calc(50% - 5px)', cursor: 'ns-resize' }} onMouseDown={(e) => handleMouseDown(e, 'top')} />
            }
            {
              isHeightPx && isWidthPx &&
              <i style={{ ...toolItemStyle, left: 'calc(100% - 5px)', cursor: 'nesw-resize' }} onMouseDown={(e) => handleMouseDown(e, 'topRight')} />
            }
          </>
        }
      </div>
      <div style={{ ...toolRowStyle }}>
        {
          FeatureStore.SelectedFeature.Resizer && isWidthPx &&
          <>
            <i style={{ ...toolItemStyle, left: '-5px', cursor: 'ew-resize' }} onMouseDown={(e) => handleMouseDown(e, 'left')} />
            <i style={{ ...toolItemStyle, left: 'calc(100% - 5px)', cursor: 'ew-resize' }} onMouseDown={(e) => handleMouseDown(e, 'right')} />
          </>
        }
      </div>
      <div style={{ ...toolRowStyle, top: '-6px' }}>
        {
          FeatureStore.SelectedFeature.Resizer &&
          <>
            {
              isHeightPx && isWidthPx &&
              <i style={{ ...toolItemStyle, left: '-5px', cursor: 'nesw-resize' }} onMouseDown={(e) => handleMouseDown(e, 'bottomLeft')} />
            }
            {
              isHeightPx &&
              <i style={{ ...toolItemStyle, left: 'calc(50% - 5px)', cursor: 'ns-resize' }} onMouseDown={(e) => handleMouseDown(e, 'bottom')} />
            }
            {
              isHeightPx && isWidthPx &&
              <i style={{ ...toolItemStyle, left: 'calc(100% - 5px)', cursor: 'nwse-resize' }} onMouseDown={(e) => handleMouseDown(e, 'bottomRight')} />
            }
          </>
        }
      </div>
    </div>
  );
}
