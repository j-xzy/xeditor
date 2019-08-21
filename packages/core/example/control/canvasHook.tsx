import * as React from 'react';
import { useCanvasDispatch, useCanvaState } from '../../src';

export function CanvasHookControl(props: { style: React.CSSProperties }) {
  const style = useCanvaState((s) => s.style);
  const dispatch = useCanvasDispatch();
  return (
    <div style={props.style}>
      <h3>CanvasHook属性</h3>
      <div>
        <label>width</label> <input type='text' value={style.width || ''} onChange={({ target: { value } }) => dispatch({ type: 'style', data: { ...style, width: value } })} />
      </div>
      <div>
        <label>height</label> <input type='text' value={style.height || ''} onChange={({ target: { value } }) => dispatch({ type: 'style', data: { ...style, height: value } })} />
      </div>
      <div>
        <label>scale</label> <input type='text' value={style.scale || ''} onChange={({ target: { value } }) => dispatch({ type: 'style', data: { ...style, scale: value } })} />
      </div>
    </div>
  );
}
