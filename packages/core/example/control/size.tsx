import * as React from 'react';
import { useFeatureDispatch, useFeatureState } from '../../src';

export function SizeControl(props: {}) {
  const size = useFeatureState((s) => ({ width: s.state.style!.width, height: s.state.style!.height }));

  const dispatch = useFeatureDispatch();
  if (!size || !dispatch) {
    return null;
  }

  let { width, height } = size;
  if (!width) {
    width = '';
  }
  if (!height) {
    height = '';
  }

  return (
    <div>
      <h3>Size</h3>
      <div>
        <label>width</label> <input type='text' value={width} onChange={({ target: { value } }) => dispatch({ type: 'width', data: value })} />
      </div>
      <div>
        <label>height</label> <input type='text' value={height} onChange={({ target: { value } }) => dispatch({ type: 'height', data: value })} />
      </div>
    </div>
  );
}
