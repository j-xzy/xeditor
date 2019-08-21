import * as React from 'react';
import { controlConnector, pluginConnector } from '../../src';
import { parsePaddingShotCutAttr } from '../../src/lib/tool';

interface IProps {
  padding?: string;
  updatePadding?: (padding: string) => void;
  ShortCut?: any;
}

function mapStateToProps(state: any, ownProps: IProps) {
  if (!state.style) {
    return { padding: null };
  }
  const { padding } = state.style;
  return { padding };
}

function mapDispatchToProps(dispatch: Editor.IDispatch, ownProps: any) {
  return {
    updatePadding: (padding: string) => {
      dispatch(
        {
          type: 'padding',
          data: padding
        }
      );
    }
  };
}

class RawPaddingControl extends React.Component<IProps, {}> {

  public static defaultProps = {
    padding: '0 0 0 0'
  };

  constructor(props: IProps) {
    super(props);
    this.handlePaddingChange = this.handlePaddingChange.bind(this);
  }

  public render() {
    if (!this.props.padding) {
      return null;
    }
    const padding = parsePaddingShotCutAttr(this.props.padding!);
    return (
      <div>
        <h3>Padding</h3>
        <div>
          <label>top</label> <input type='text' value={padding.top} onChange={({ target: { value } }) => this.handlePaddingChange('top', value)} />
        </div>
        <div>
          <label>right</label> <input type='text' value={padding.right} onChange={({ target: { value } }) => this.handlePaddingChange('right', value)} />
        </div>
        <div>
          <label>bottom</label> <input type='text' value={padding.bottom} onChange={({ target: { value } }) => this.handlePaddingChange('bottom', value)} />
        </div>
        <div>
          <label>left</label> <input type='text' value={padding.left} onChange={({ target: { value } }) => this.handlePaddingChange('left', value)} />
        </div>
      </div>
    );
  }

  private handlePaddingChange(type: string, value: string) {
    const padding: any = parsePaddingShotCutAttr(this.props.padding!);
    padding[type] = value;
    this.props.updatePadding!(`${padding.top} ${padding.right} ${padding.bottom} ${padding.left}`);
  }
}
// 测试pluginConnector
export const PaddingControl = controlConnector(mapStateToProps, mapDispatchToProps)(pluginConnector('ShortCut')(RawPaddingControl));
