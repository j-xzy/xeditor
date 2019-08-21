import React from 'react';

function reducer(action, state) {
  return state;
}

class Property extends React.Component {
  constructor() {
    super();
  }

  renderProperety(property) {
    return Object.keys(property).map((key, idx) => <div key={idx}>
        {key}:{typeof property[key] === 'object' ? this.renderProperety(property[key]) : property[key]}
      </div>);
  }

  render() {
    const {
      property,
      style
    } = this.props;
    return (
      /** 注意: class加前缀避免冲突! */
      <div className='example-property' style={{ ...style
      }}>
        {this.renderProperety(property)}
      </div>
    );
  }

}

export default {
  reducer: reducer,
  component: Property
};