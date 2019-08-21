import * as React from 'react';
import { featureConnector } from '../../src/index';

class BoxPreview extends React.Component<Editor.IPreivewComponentProps, {}> implements Editor.IPreivewComponent {
  public render() {
    return this.props.connect(<div style={{ border: '1px solid #000', height: '25px', width: '100px' }}>Error</div>);
  }
}

const img = new Image();
img.src = require('../img.jpg');

const preview = { PreivewComponent: BoxPreview, dragImg: img };

const initialState: Editor.IFeatureState = {
  name: 'ERROR',
  style: {
    visibility: 'visible',
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
    bottom: 'auto'
  },
  text: '这是一段text'
};

function reducer(action: Editor.IAction, state = initialState) {
  return state;
}

const option: Editor.IFeatureOption = {
  resizer: true
};

export class RawBlock extends React.Component<Editor.IWrappedFeatureComponentProps, {}> {

  constructor(props: Editor.IWrappedFeatureComponentProps) {
    super(props);
  }

  public render() {
    return this.props.connec!(
      <div style={this.props.style}>
        <div style={{ background: 'red', width: '100%', height: '100%' }}>
          <button>按钮</button>
          {this.props.text}
        </div>
      </div>
    );
  }
}

export const ErrorBlock = featureConnector(option, preview, reducer)(RawBlock);
