import { useCanvasDispatch, useCanvaState } from '@xeditor/editor';
import { Slider } from 'lite-ui';
import * as React from 'react';
import './style.styl';

interface IProps {
  onChange: () => void;
}

export function Scale(props: IProps) {
  const state = useCanvaState(React.useCallback((s) => s, []));
  const dispatch = useCanvasDispatch();
  return (
    <Slider
      className='scale-slider'
      onChange={(value) => { props.onChange(); dispatch({ type: 'style', data: { ...state.style, scale: value } }); }}
      value={state.style.scale}
      max={2}
      min={0.1}
      step={0.01}
    />
  );
}
