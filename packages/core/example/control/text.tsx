import * as React from 'react';
import { useFeatureDispatch, useFeatureState } from '../../src';

interface IProps {
  style: React.CSSProperties;
}

export const TextControl = (props: IProps) => {
  let text = useFeatureState((s) => s.state.text);
  const dispatch = useFeatureDispatch();
  if (!text || !dispatch) {
    return null;
  }

  if (!text) {
    text = '';
  }

  return (
    <div style={props.style}>
      <h3>Text</h3>
      <input type='text' value={text || ''} onChange={({ target: { value } }) => dispatch({ type: 'text', data: value })} />
    </div>
  );
};
