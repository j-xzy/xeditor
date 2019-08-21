import * as React from 'react';
import { featureConnector } from '../../src/index';

interface IProps extends Editor.IPreivewComponentProps {
  name: string;
}

class BoxPreview extends React.Component<IProps, {}> implements Editor.IPreivewComponent {
  public render() {
    return this.props.connect(<div style={{ border: '1px solid #000', height: '25px', width: '100px' }}>{this.props.name}</div>);
  }
}

const preview = { PreivewComponent: BoxPreview, dragImg: new Image() };

const initialState: Editor.IFeatureState = {
  name: '组件一, block',
  style: {
    margin: '15px 0',
    padding: '10px 0',
    width: '200px',
    height: '200px',
    float: 'none',
    display: 'block',
    position: 'relative',
    overflow: 'hidden',
    top: 'auto',
    left: 'auto',
    right: 'auto',
    bottom: 'auto',
    visibility: 'visible'
  },
  text: '这是一段text'
};

function reducer(action: Editor.IAction, state = initialState) {
  return state;
}

const option: Editor.IFeatureOption = {
  resizer: false,
  toolbar: false,
  history: false
};

export class RawBlock extends React.Component<Editor.IWrappedFeatureComponentProps, {}> {

  constructor(props: Editor.IWrappedFeatureComponentProps) {
    super(props);
  }

  public render() {
    return this.props.connect!(
      <div style={this.props.style}>
        loading...
      </div>
    );
  }

  public componentDidMount() {
    setTimeout(() => {
      this.props.replace({ resizer: true }, reducer, {}, Foo);
    }, 2000);
  }
}

class Foo extends React.Component<Editor.IWrappedFeatureComponentProps, {}> {

  constructor(props: Editor.IWrappedFeatureComponentProps) {
    super(props);
  }

  public render() {
    return this.props.connect!(
      <div style={{ ...this.props.style, border: '1px solid black' }}>
        loaded!!
      </div>
    );
  }
}
export const Replace = featureConnector<{name: string}>(option, preview, reducer)(RawBlock);
