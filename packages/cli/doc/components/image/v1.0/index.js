import React from 'react';
const initialState = {
  name: '图片',
  style: {
    width: '300px',
    height: '300px'
  },
  property: {
    backgroundImage: 'http://www.w3school.com.cn/i/eg_tulip.jpg',
    backgroundSize: 'cover'
  }
};

const option = {
  event: {
    trigger: [
      {
        name: '点击',
        type: 'click'
      }
    ]
  },
  property: {
    backgroundImage: {
      name: '背景图',
      type: 'upload'
    },
    backgroundSize: {
      name: '图片大小',
      type: 'input'
    }
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
    const { backgroundImage, backgroundSize } = this.props.property;
    return (
      <div  onClick={() => this.props.trigger('click')} style={{ ...this.props.style, backgroundSize, backgroundImage: `url(${backgroundImage})` }}>
      </div>
    );
  }
}

export default {
  reducer: reducer,
  component: Button,
  option
};
