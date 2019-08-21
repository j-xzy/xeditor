import { featureConnector } from '@xeditor/core';
import * as React from 'react';

interface IProps extends Editor.IPreivewComponentProps {
  name: string;
}

function BoxPreview(props: IProps & IProps) {
  return props.connect(<div style={{ border: '1px solid #000', height: '25px', width: '100px' }}>{props.name}</div>);
}

const preview = { PreivewComponent: BoxPreview, dragImg: new Image() };

export const initialState: Editor.IFeatureState = {
  name: '变量',
  data: ''
};

export function reducer(action: Editor.IAction, state = initialState) {
  return state;
}

export const option: Editor.IFeatureOption = {
  resizer: true,
  group: '变量'
};

export const VarComp = featureConnector<{ name: string }>(option, preview, reducer)();
