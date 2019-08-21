import { featureConnector } from '@xeditor/core';
import * as React from 'react';

class BoxPreview extends React.Component<{ connect: any }, {}> {
  public render() {
    return this.props.connect(<div style={{ border: '1px solid #000', height: '25px', width: '100px' }}>event2</div>);
  }
}

const preview = { PreivewComponent: BoxPreview, dragImg: new Image() };

export const initialState: IFeatureState = {
  name: '事件组件2',
  style: {
    visibility: 'visible',
    margin: '15px 0',
    padding: '10px 0',
    width: '100px',
    height: '100px',
    float: 'none',
    display: 'block',
    position: 'relative',
    overflow: 'hidden',
    top: 'auto',
    left: 'auto'
  }
};

export function reducer(action: IAction, state = initialState) {
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

const option: IFeatureOption = {
  event: {
    trigger: [{
      name: '按一下2',
      type: 'fooClick2'
    }, {
      name: '鼠标移上2',
      type: 'mouseHover2'
    }],
    response: [{
      name: '赋值2',
      type: 'assgin2'
    }, {
      name: 'xxxxx2',
      type: 'xxxxx2'
    }]
  },
  group: '变量'
};

export class RawEvent extends React.Component<IWrappedFeatureComponentProps, {}> {

  constructor(props: IWrappedFeatureComponentProps) {
    super(props);
  }

  public render() {
    return this.props.connect!(
      <div style={this.props.style}>
        id: {this.props.id}
        组件2
        <div>
          <button onMouseDown={() => this.props.trigger('fooClick')}>点击</button>
        </div>
      </div>
    );
  }
}

export const EventComp2 = featureConnector<{ trigger: (type: string) => void }>(option, preview, reducer)(RawEvent);
