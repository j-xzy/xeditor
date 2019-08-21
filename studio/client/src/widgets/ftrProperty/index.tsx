import { useFeatureDispatch, useFeatureState } from '@xeditor/core';
import * as React from 'react';
import { PropertyWidget } from '../property';
import { ftrStyleDic } from './ftrStyleDic';

interface IProps {
  type: 'style' | 'property';
}

// tslint:disable-next-line: no-default-export
export default React.memo((props: IProps) => {
  const ftrState = useFeatureState(React.useCallback(
    (s) => ({ state: s.state[props.type], id: s.state.id, option: s.option }),
    [props.type])
  );

  const dispatch = useFeatureDispatch();
  if (!ftrState || !dispatch) {
    return null;
  }

  const dic = props.type === 'style' ? ftrStyleDic : ftrState.option.property;
  if (!dic) {
    return null;
  }

  const handleDicpatch = (p: { type: string, data: any }) => {
    const type = p.type.split('-')[1];
    let data = p.data;
    if (type === 'backgroundImage') {
      data = `url(${data})`;
    }
    dispatch({ type: p.type, data });
  };

  return <PropertyWidget ftrId={ftrState.id} dic={dic} type={props.type} state={ftrState.state} dispatch={handleDicpatch} />;
});
