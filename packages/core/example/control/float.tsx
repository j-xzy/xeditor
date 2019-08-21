import * as React from 'react';
import { controlConnector } from '../../src';

interface IProps {
  float?: Editor.IFloat;
  onFloatChange?: (float: string) => void;
}

function mapStateToProps(state: any, ownProps: IProps) {
  if (!state.style) {
    return { float: null };
  }
  const { float } = state.style;
  return { float };
}

const mapDispatchToProps = {
  onFloatChange: (float: string) => ({
    type: 'float',
    data: float
  })
};

class RawFloatControl extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  public render() {
    if (!this.props.float) {
      return null;
    }
    return (
      <div>
        <h3>Float</h3>
        <select value={this.props.float} onChange={this.handleSelectChange}>
          <option value='none' >none</option>
          <option value='left' >left</option>
          <option value='right' >right</option>
        </select>
      </div>
    );
  }

  private handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    this.props.onFloatChange!(e.target.value);
  }
}

export const FloatControl = controlConnector(mapStateToProps, mapDispatchToProps)(RawFloatControl);
