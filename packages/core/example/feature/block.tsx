import * as React from 'react';
import { featureConnector } from '../../src/index';

interface IProps extends Editor.IPreivewComponentProps {
  name: string;
}

function BoxPreview(props: IProps & IProps) {
  return props.connect(<div style={{ border: '1px solid #000', height: '25px', width: '100px' }}>{props.name}</div>);
}

const preview = { PreivewComponent: BoxPreview, dragImg: new Image() };

export const initialState: Editor.IFeatureState = {
  name: '组件一, block',
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

export function reducer(action: Editor.IAction, state = initialState) {
  const newState = { ...state };
  switch (action.type) {
    case 'text':
      newState.text = action.data;
      return newState;
    default:
      return state;
  }
}

export const option: Editor.IFeatureOption = {
  resizer: true
};

export class RawBlock extends React.Component<Editor.IWrappedFeatureComponentProps & { text: string }, {}> {

  constructor(props: Editor.IWrappedFeatureComponentProps & { text: string }) {
    super(props);
  }

  public render() {
    return this.props.connect!(
      <div style={this.props.style}>
        <div style={{ background: 'red', width: '100%', height: '100%', zIndex: 1000, position: 'absolute' }}>
          <button>按钮</button>
          {this.props.text}
        </div>
      </div>
    );
  }
}

export const Block = featureConnector<{ name: string }>(option, preview, reducer)(RawBlock);
