import * as React from 'react';
import { featureConnector } from '../../src/index';

interface IProps extends Editor.IPreivewComponentProps {
  name: string;
}

class BoxPreview extends React.Component<IProps, {}> implements Editor.IPreivewComponent {
  public render() {
    return this.props.connect(<div style={{ border: '1px solid #000', height: '25px', width: '100px' }}>remove</div>);
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
    maxHeight: 'auto',
    minHeight: 'auto',
    maxWidth: 'auto',
    minWidth: 'auto',
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
  resizer: true,
  toolbar: true,
  history: false
};

export class RawBlock extends React.Component<Editor.IWrappedFeatureComponentProps, {}> {

  constructor(props: Editor.IWrappedFeatureComponentProps) {
    super(props);
  }

  public render() {
    return this.props.connect!(
      <div style={this.props.style}>
        removing...
      </div>
    );
  }

  public componentDidMount() {
    setTimeout(() => {
      this.props.remove();
    }, 2000);
  }
}

export const RemoveBlock = featureConnector(option, preview, reducer)(RawBlock);
