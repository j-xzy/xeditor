import * as React from 'react';
import { controlConnector } from '../../src';

interface IProps {
  position?: Editor.IPositionType;
  left?: string;
  top?: string;
  onPositionChange?: (position: string) => void;
  onLeftChange?: (left: string) => void;
  onTopChange?: (right: string) => void;
}

function mapStateToProps(state: any, ownProps: IProps) {
  if (!state.style) {
    return { position: null, left: null, top: null };
  }
  const { position, left, top } = state.style;
  return { position, left, top };
}

const mapDispatchToProps = {
  onPositionChange: (position: string) => ({
    type: 'position',
    data: position
  }),
  onLeftChange: (left: string) => ({
    type: 'left',
    data: left
  }),
  onTopChange: (top: string) => ({
    type: 'top',
    data: top
  })
};

class RawPositionControl extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  public render() {
    if (!this.props.position) {
      return null;
    }

    return (
      <div>
        <h3>Position</h3>
        <select value={this.props.position} onChange={this.handleSelectChange}>
          <option value='static' >static</option>
          <option value='relative' >relative</option>
          <option value='fixed' >fixed</option>
          <option value='absolute' >absolute</option>
        </select>
        <div>
          left: <input type='text' value={this.props.left} onChange={(e) => this.props.onLeftChange!(e.target.value)} />
        </div>
        <div>
          top: <input type='text' value={this.props.top} onChange={(e) => this.props.onTopChange!(e.target.value)} />
        </div>
      </div>
    );
  }

  private handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    this.props.onPositionChange!(e.target.value);
  }
}

export const PositionControl = controlConnector(mapStateToProps, mapDispatchToProps)(RawPositionControl);
