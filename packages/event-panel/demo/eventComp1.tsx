import { featureConnector } from '@xeditor/core';
import * as React from 'react';

class BoxPreview extends React.Component<{ connect: any }, {}> {
  public render() {
    return this.props.connect(<div style={{ border: '1px solid #000', height: '25px', width: '100px' }}>event1</div>);
  }
}

const preview = { PreivewComponent: BoxPreview, dragImg: new Image() };

export const initialState: Editor.IFeatureState = {
  name: '事件组件1',
  style: {
    position: 'relative',
    visibility: 'visible',
    display: 'block',
    float: 'none',
    width: '100px',
    height: '100px',
    zIndex: 0,
    margin: '0px',
    padding: '10px',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0'
  },
  property: {
    foo: 'x',
    bar: 'y'
  }
};

export function reducer(action: Editor.IAction, state = initialState) {
  const newState = { ...state };
  switch (action.type) {
    case 'style':
      newState.style = action.data;
      return newState;
    case 'height':
      newState.style = { ...newState.style, height: action.data };
      return newState;
    case 'width':
      newState.style = { ...newState.style, width: action.data };
    case 'display':
      newState.style = { ...newState.style, display: action.data };
      return newState;
    case 'float':
      newState.style = { ...newState.style, float: action.data };
      return newState;
    case 'margin':
      newState.style = { ...newState.style, margin: action.data };
      return newState;
    case 'padding':
      newState.style = { ...newState.style, padding: action.data };
      return newState;
    case 'position':
      newState.style = { ...newState.style, position: action.data };
      return newState;
    case 'name':
      newState.name = action.data;
      return newState;
    case 'text':
      newState.text = action.data;
      return newState;
    default:
      return state;
  }
}

const option: any = {
  event: {
    trigger: [{
      name: '按一下1',
      type: 'fooClick1'
    }, {
      name: '鼠标移上1',
      type: 'mouseHover1'
    }],
    response: [{
      name: '设置属性',
      type: 'setProperty'
    }, {
      name: '设置样式',
      type: 'setStyle'
    }, {
      name: 'xxxxx',
      type: 'xxxx'
    }]
  },
  property: {
    foo: {
      name: '中文1',
      type: 'input'
    },
    bar: {
      name: '中文2',
      type: 'select',
      config: [{ name: 'name', value: 'value' }]
    }
  }
};

export class RawEvent extends React.Component<Editor.IWrappedFeatureComponentProps, {}> {

  constructor(props: Editor.IWrappedFeatureComponentProps) {
    super(props);
  }

  public render() {
    return this.props.connect!(
      <div style={this.props.style}>
        id: {this.props.id}
        组件1
        <div>
          <button onMouseDown={() => this.props.trigger('fooClick')}>点击</button>
        </div>
      </div>
    );
  }
}

export const EventComp1 = featureConnector<{ trigger: (type: string) => void }>(option, preview, reducer)(RawEvent);
