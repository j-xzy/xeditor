import * as React from 'react';
import { controlConnector } from '../../src';
import { parsePaddingShotCutAttr } from '../../src/lib/tool';

interface IProps {
  margin?: string;
  updateMargin?: (margin: string) => void;
}

function mapStateToProps(state: any, ownProps: IProps) {
  if (!state.style) {
    return { margin: null };
  }
  const { margin } = state.style;
  return { margin };
}

// const mapDispatchToProps = {
//   onHeightChange: (height: string) => ({
//     type: 'height',
//     data: height
//   }),
//   onWidthChange: (width: string) => ({
//     type: 'width',
//     data: width
//   })
// };

function mapDispatchToProps(dispatch: Editor.IDispatch, ownProps: any) {
  return {
    updateMargin: (margin: string) => {
      dispatch(
        {
          type: 'margin',
          data: margin
        }
      );
    }
  };
}

class RawMarginControl extends React.Component<IProps, {}> {

  public static defaultProps = {
    margin: '0 0 0 0'
  };

  constructor(props: IProps) {
    super(props);
    this.handleMarginChange = this.handleMarginChange.bind(this);
  }

  public render() {
    if (!this.props.margin) {
      return null;
    }
    const margin = parsePaddingShotCutAttr(this.props.margin!);
    return (
      <div>
        <h3>Margin</h3>
        <div>
          <label>top</label> <input type='text' value={margin.top} onChange={({ target: { value } }) => this.handleMarginChange('top', value)} />
        </div>
        <div>
          <label>right</label> <input type='text' value={margin.right} onChange={({ target: { value } }) => this.handleMarginChange('right', value)} />
        </div>
        <div>
          <label>bottom</label> <input type='text' value={margin.bottom} onChange={({ target: { value } }) => this.handleMarginChange('bottom', value)} />
        </div>
        <div>
          <label>left</label> <input type='text' value={margin.left} onChange={({ target: { value } }) => this.handleMarginChange('left', value)} />
        </div>
      </div>
    );
  }

  private handleMarginChange(type: string, value: string) {
    const margin: any = parsePaddingShotCutAttr(this.props.margin!);
    margin[type] = value;
    this.props.updateMargin!(`${margin.top} ${margin.right} ${margin.bottom} ${margin.left}`);
  }
}

export const MarginControl = controlConnector(mapStateToProps, mapDispatchToProps)(RawMarginControl);
