import { featureConnector } from '@xeditor/core';
import * as React from 'react';

const style = {
  outline: '1px dashed rgba(170,170,170,0.7)',
  outlineOffset: '-10px'
};

const boxOption = {
  name: '容器组件',
  resizer: true,
  history: false,
  container: true
};

const boxInitialState: IFeatureState = {
  name: '容器组件',
  style: {
    margin: '0px',
    padding: '10px',
    width: '250px',
    height: '280px',
    maxHeight: 'auto',
    minHeight: 'auto',
    maxWidth: 'auto',
    minWidth: 'auto',
    float: 'none',
    display: 'inline-block',
    position: 'relative',
    overflow: 'hidden',
    top: 'auto',
    left: 'auto',
    visibility: 'visible',
    ...style
  }
};

function boxReducer(action: IAction, state = boxInitialState) {
  return state;
}

class Box extends React.Component<IWrappedFeatureComponentProps, {}> {
  public render() {
    return this.props.connect!(
      <div style={this.props.style}>
        {this.props.children}
      </div>
    );
  }
}

class ContainerPreview extends React.Component<{ connect: any }, {}> {
  public render() {
    return this.props.connect(<div style={{ border: '1px solid #000', height: '25px', width: '100px' }}>容器组件</div>);
  }
}
const preview = { PreivewComponent: ContainerPreview, dragImg: new Image() };

export const containerInitialState: IFeatureState = {
  name: '容器',
  style: {
    visibility: 'visible',
    margin: '0px',
    padding: '10px',
    width: '800px',
    height: '300px',
    maxHeight: 'auto',
    minHeight: 'auto',
    maxWidth: 'auto',
    minWidth: 'auto',
    float: 'none',
    display: 'block',
    position: 'relative',
    overflow: 'auto',
    top: 'auto',
    left: 'auto',
    right: 'auto',
    bottom: 'auto',
    ...style
  }
};

export function containerReducer(action: IAction, state = containerInitialState) {
  const newState = { ...state };
  switch (action.type) {
    case 'style':
      newState.style = action.data;
      return newState;
    case 'height':
      newState.style = { ...newState.style, width: action.data };
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
    case 'text':
      newState.text = action.data;
      return newState;
    default:
      return state;
  }
}

export const containerOption: IFeatureOption = {
  resizer: true,
  container: true,
  history: false
};

export class RawContainer extends React.Component<IWrappedFeatureComponentProps, {}> {

  constructor(props: IWrappedFeatureComponentProps) {
    super(props);
    this.props.appendChildFeatures([{
      component: Box,
      reducer: boxReducer,
      option: boxOption,
      props: {}
    },
    {
      component: Box,
      reducer: boxReducer,
      option: boxOption,
      props: {}
    }, {
      component: Box,
      reducer: boxReducer,
      option: boxOption,
      props: {}
    }]);
  }

  public render() {
    return this.props.connect!(
      <div style={this.props.style}>
        {this.props.children}
      </div>
    );
  }
}

export const Container = featureConnector(containerOption, preview, containerReducer)(RawContainer);
