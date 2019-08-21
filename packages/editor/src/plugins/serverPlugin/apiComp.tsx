import { featureConnector } from '@xeditor/core';
import update from 'immutability-helper';
import * as React from 'react';

interface IProps extends React.Props<any> {
}

const initialState: Editor.IFeatureState = {
  name: 'API',
  property: {
    method: 'GET',
    url: '',
    body: ''
  },
  data: ''
};

export function reducer(action: Editor.IAction, state = initialState) {
  if (action.type === 'property-method') {
    return update(state, { property: { method: { $set: action.data } } });
  }
  if (action.type === 'property-url') {
    return update(state, { property: { url: { $set: action.data } } });
  }
  if (action.type === 'property-body') {
    return update(state, { property: { body: { $set: action.data } } });
  }
  if (action.type === 'data') {
    return update(state, { data: { $set: action.data } });
  }
  return state;
}

export const option: Editor.IFeatureOption = {
  group: '服务',
  event: {
    trigger: [
      {
        name: '初始',
        type: 'init'
      }, {
        name: '改变',
        type: 'change'
      }
    ],
    response: [
      {
        name: '请求',
        type: 'request'
      }, {
        name: '设置属性',
        type: 'setProperty'
      }, {
        name: '设置数据',
        type: 'setData'
      }
    ]
  },
  property: {
    method: {
      name: 'method',
      type: 'select',
      config: [
        {
          name: 'GET',
          value: 'GET'
        },
        {
          name: 'POST',
          value: 'POST'
        }, {
          name: 'PUT',
          value: 'PUT'
        }, {
          name: 'DELETE',
          value: 'DELETE'
        }
      ]
    },
    url: {
      name: 'URL',
      type: 'input'
    },
    body: {
      name: 'BODY',
      type: 'json'
    }
  },
  data: {
    name: '数据',
    type: 'json',
    binded: false
  }
};

export function ApiComp(props: IProps) {
  const PreivewComponent = function(prevProps: Editor.IPreivewComponentProps) {
    return prevProps.connect(React.Children.only(props.children));
  };
  const preview = { PreivewComponent, dragImg: new Image() };

  return React.createElement(featureConnector(option, preview, reducer)(), { ...props } as any);
}
