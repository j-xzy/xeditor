import React from 'react'
import update from 'immutability-helper';
import * as f from './foo'
import * as flv from 'flv.js';

const initialState = {
  name: '文字',
  style: {
    width: '140px',
    height: '40px',
  },
  property: {
    text: {
      fontSize: '35px',
      fontStyle: 'normal',
      fontWeight: 'normal',
      textAlign: 'left',
      lineHeight: '35px',
      fontFamily: 'none',
      color: 'rgba(0, 0, 0, 0.65)'
    }
  },
  data: '一段文字'
};

const option = {
  event: {
    response: [
      {
        name: '赋值',
        type: 'assgin'
      }
    ]
  }
};

function reducer(action, state = initialState) {
  switch (action.type) {
    case 'assgin': {
      return update(state, { data: { $set: action.data } });
    }
  }
  return state;
}

class Text extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div style={{ ...this.props.style, ...this.props.property.text }}>
        {this.props.data}
      </div>
    );
  }
}

export default {
  reducer: reducer,
  component: Text,
  option
};
