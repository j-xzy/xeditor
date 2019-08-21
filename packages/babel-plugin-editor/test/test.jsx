import React from 'react'
import update from 'immutability-helper';
import * as flv from 'flv.js'
import hls from 'hls.js'
import * as b from 'ol-commonjs';
import * as c from 'leaflet';
import * as d from './compiled.js'

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
  data: {
    json: [{
      name: '',
      value: '一段文字'
    }],
    api: {
      data: [],
      form: {
        url: 'www'
      }
    },
    type: 'json'
  }
};

const option = {
  event: {
    response: [
      {
        name: '赋值',
        type: 'assgin'
      },
      {
        name: '更改url',
        type: 'changeUrl'
      }
    ]
  }
};

function reducer(action, state = initialState) {
  switch (action) {
    case 'assgin': {
      return update(state, { data: { json: { [0]: { value: { $set: action.data } } } } });
    }
  }
  return state;
}

function Text(props) {
  return (
    <div style={{ ...props.style, ...props.property.text }}>
      {props.value}
    </div>
  );
}

// class Text extends React.Component {
//   render() {
//     return (
//       <div style={{ ...props.style, ...props.property.text }}>
//         {props.value}
//       </div>
//     );
//   }
// }

export default {
  reducer: reducer,
  component: Text,
  option
};
