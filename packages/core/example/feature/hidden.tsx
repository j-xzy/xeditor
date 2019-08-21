import * as React from 'react';
import { featureConnector } from '../../src/index';

function BoxPreview(props: Editor.IPreivewComponentProps) {
  return props.connect(<div style={{ border: '1px solid #000', height: '25px', width: '100px' }}>hidden</div>);
}

const preview = { PreivewComponent: BoxPreview, dragImg: new Image() };

export const initialState = {
  name: 'hidden组件'
};

export function reducer(action: Editor.IAction, state = initialState) {
  const newState = { ...state };
  switch (action.type) {
    case 'name':
      newState.name = action.data;
      return newState;
    default:
      return state;
  }
}

export const option: Editor.IFeatureOption = {
  resizer: true,
  group: '变量'
};

export const Hidden = featureConnector(option, preview, reducer)();
