import * as React from 'react';
import { controlConnector } from '../../src';

interface IProps {
  name?: string;
  onNameChange?: (name: string) => void;
}

function mapStateToProps(state: Editor.IFeatureState, ownProps: IProps) {
  return { name: state.name };
}

const mapDispatchToProps = {
  onNameChange: (name: string) => ({
    type: 'name',
    data: name
  })
};

export class RawNameControl extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    let name = this.props.name;
    if (!name) {
      name = '';
    }
    return (
      <div>
        <h3>Name</h3>
        <input type='name' value={name} onChange={({ target: { value } }) => this.props.onNameChange!(value)} />
      </div>
    );
  }
}

export const NameControl = controlConnector(mapStateToProps, mapDispatchToProps)(RawNameControl);
