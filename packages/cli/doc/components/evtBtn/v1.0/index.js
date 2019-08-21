import React from 'react';
import './style.scss';

const initialState = {
  name: '按钮',
  style: {
    width: '150px',
    height: '40px',
    padding: '10px'
  }
};

const option = {
  event: {
    trigger: [
      {
        name: '点击按钮一',
        type: 'oneClick'
      },
      {
        name: '点击按钮二',
        type: 'twoClick'
      }
    ]
  }
};

function reducer(action, state = initialState) {
  return state;
}

class Button extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className='evt-btn' style={{ ...this.props.style }}>
        <button onClick={() => this.props.trigger('oneClick')}>按钮一</button>
        <button onMouseDown={() => this.props.trigger('twoClick')}>按钮二</button>
      </div>
    );
  }
}

export default {
  reducer: reducer,
  component: Button,
  option
};
