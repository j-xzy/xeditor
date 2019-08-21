export const ftrStyleDic: Editor.IWidget = {
  position: {
    name: '定位',
    type: 'select',
    config: [
      {
        name: '绝对定位',
        value: 'absolute'
      },
      {
        name: '相对定位',
        value: 'relative'
      }, {
        name: '窗口定位',
        value: 'fixed'
      }, {
        name: '静态定位',
        value: 'static'
      }
    ]
  },
  visibility: {
    name: '显示',
    type: 'switch',
    config: {
      on: 'visible',
      off: 'hidden'
    }
  },
  display: {
    name: '元素类型',
    type: 'select',
    config: [
      {
        name: '无',
        value: 'none'
      }, {
        name: '块元素',
        value: 'block'
      },
      {
        name: '行内元素',
        value: 'inline-block'
      }, {
        name: '弹性元素',
        value: 'flex'
      }
    ]
  },
  float: {
    name: '浮动',
    type: 'select',
    config: [
      {
        name: '无浮动',
        value: 'none'
      }, {
        name: '左浮动',
        value: 'left'
      },
      {
        name: '右浮动',
        value: 'right'
      }
    ]
  },
  width: {
    name: '宽',
    type: 'input'
  },
  height: {
    name: '高',
    type: 'input'
  },
  zIndex: {
    name: '层级',
    type: 'input'
  },
  margin: {
    name: '外边距',
    type: 'input'
  },
  padding: {
    name: '内边距',
    type: 'input'
  },
  top: {
    name: '上',
    type: 'input'
  },
  left: {
    name: '左',
    type: 'input'
  },
  right: {
    name: '右',
    type: 'input'
  },
  bottom: {
    name: '下',
    type: 'input'
  },
  flexDirection: {
    name: '弹性方向',
    type: 'select',
    config: [{
      name: '水平',
      value: 'row'
    }, {
      name: '反向水平',
      value: 'row-reverse'
    }, {
      name: '垂直',
      value: 'column'
    }, {
      name: '反向垂直',
      value: 'column-reverse'
    }]
  },
  justifyContent: {
    name: '主轴对齐',
    type: 'select',
    config: [{
      name: '起始',
      value: 'flex-start'
    }, {
      name: '末尾',
      value: 'flex-end'
    }, {
      name: '中心',
      value: 'center'
    }, {
      name: '中间',
      value: 'space-between'
    }, {
      name: '环绕',
      value: 'space-around'
    }]
  },
  alignItems: {
    name: '侧轴对齐',
    type: 'select',
    config: [{
      name: '拉伸',
      value: 'stretch'
    }, {
      name: '中心',
      value: 'center'
    }, {
      name: '起始',
      value: 'flex-start'
    }, {
      name: '末尾',
      value: 'flex-end'
    }, {
      name: '基线',
      value: 'baseline'
    }]
  },
  flex: {
    name: 'flex',
    type: 'input'
  },
  backgroundImage: {
    name: '背景图',
    type: 'upload',
    binded: false
  },
  backgroundSize: {
    name: '图片大小',
    type: 'input'
  },
  backgroundColor: {
    name: '背景色',
    type: 'color'
  }
};
