import { featureConnector } from '@xeditor/core';
import * as React from 'react';

interface IProps extends React.Props<any> {
}

const initialState: Editor.IFeatureState = {
  name: '变量',
  data: ''
};

export function reducer(action: Editor.IAction, state = initialState) {
  if (action.type === 'data') {
    return { ...state, data: action.data };
  }
  return state;
}

export const option: Editor.IFeatureOption = {
  group: '变量',
  event: {
    trigger: [{
      name: '初始',
      type: 'init'
    },
    {
      name: '改变',
      type: 'change'
    }],
    response: [{
      name: '赋值',
      type: 'setData'
    }]
  },
  data: {
    name: '值',
    type: 'json',
    binded: false
  }
};

export function VarComp(props: IProps) {
  const PreivewComponent = function(prevProps: Editor.IPreivewComponentProps) {
    return prevProps.connect(React.Children.only(props.children));
  };
  const preview = { PreivewComponent, dragImg: new Image() };

  return React.createElement(featureConnector(option, preview, reducer)(), { ...props } as any);
}
