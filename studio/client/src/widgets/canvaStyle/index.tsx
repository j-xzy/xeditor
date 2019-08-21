import { useCanvasDispatch, useCanvaState } from '@xeditor/editor';
import * as React from 'react';
import { PropertyWidget } from '../property';
import { dic } from './dic';

interface IProps {
  type: 'style' | 'property';
}

// tslint:disable-next-line: no-default-export
export default React.memo((props: IProps) => {
  const state = useCanvaState(React.useCallback((s) => s[props.type], [props.type]));
  const dispatch = useCanvasDispatch();

  const handleDicpatch = (p: { type: string, data: any }) => {
    const type = p.type.split('-')[1];
    let data = p.data;
    if (type === 'backgroundImage') {
      data = `url(${data})`;
    }
    dispatch({ type: p.type, data });
  };

  return <PropertyWidget type={props.type} state={state} dic={dic[props.type]} dispatch={handleDicpatch} />;
});
