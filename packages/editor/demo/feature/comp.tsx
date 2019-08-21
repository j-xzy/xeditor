import * as React from 'react';
import { advanceOption, advanceReducer, featureConnector } from '../../src';

class BoxPreview extends React.Component<{ name: string, connect: any }, {}> {
  public render() {
    return this.props.connect(<div style={{ border: '1px solid #000', height: '25px', width: '100px' }}>{this.props.name}</div>);
  }
}

const preview = { PreivewComponent: BoxPreview, dragImg: new Image() };

const initialState: Editor.IFeatureState = {
  name: '组件',
  style: {
    width: '200px',
    height: '200px'
  },
  property: {
    property1: 'x',
    property2: 'y',
    nest: {
      nest1: {
        foo: 'xxx'
      }
    }
  }
};

function reducer(action: Editor.IAction, state = initialState) {
  switch (action.type) {
    default:
      return state;
  }
}

const option: Editor.IFeatureOption = {
  resizer: true,
  path: './', // 组件路径，在这标示此组件为一个'组件'
  event: {
    trigger: [{
      name: '条件1',
      type: 'evt1'
    }],
    response: [{
      name: '动作1',
      type: 'act1'
    }]
  },
  property: {
    property1: {
      type: 'upload',
      name: '属性1'
    },
    property2: {
      type: 'radio',
      name: '属性２',
      config: [
        {
          name: '开',
          value: 'on'
        }
      ]
    },
    nest: {
      type: 'collapse',
      name: 'xxx',
      items: {
        nest1: {
          type: 'collapse',
          name: 'xxx',
          items: {
            foo:  {
              type: 'upload',
              name: 'uuuu'
            }
          }
        },
        x: {
          type: 'upload',
          name: 'xczxc'
        }
      }
    }
  }
};

type IProps = any;

class RawBlock extends React.Component<IProps, {}> {

  constructor(props: IProps) {
    super(props);
  }

  public render() {
    return this.props.connect(
      <div style={this.props.style}>
        组件
      </div>
    );
  }
}

export const Comp = featureConnector<{ name: string }>(advanceOption(option), preview, advanceReducer(reducer))(RawBlock);
