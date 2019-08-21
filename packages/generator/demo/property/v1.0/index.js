import React from 'react';

const initialState = {
  name: '属性示例',
  style: {
    width: '180px',
    height: '180px'
  },
  property: {
    input: '文本',
    select: 'value1',
    switch: 'value1',
    radio: 'value1',
    checkbox: ['value1'],
    upload: '',
    color: '#ff8800',
    slider: 5,
    nest: {
      nest1: {
        foo: '',
        bar: true,
        nest2: {
          foo: 'xxx',
          nest3: {
            name: '1'
          }
        }
      },
      prop1: 'prop1',
      prop2: 'prop2'
    }
  }
};

const option = {
  property: {
    input: {
      name: '输入框',
      type: 'input'
    },
    select: {
      name: '下拉框',
      type: 'select',
      config: [
        {
          name: '值1',
          value: 'value1'
        },
        {
          name: '值2',
          value: 'value2'
        }
      ]
    },
    switch: {
      name: '切换',
      type: 'switch',
      config: {
        on: 'value1',
        off: 'value2'
      }
    },
    radio: {
      name: '单选',
      type: 'radio',
      config: [
        {
          name: '值1',
          value: 'value1'
        },
        {
          name: '值2',
          value: 'value2'
        }
      ]
    },
    checkbox: {
      name: '多选',
      type: 'checkbox',
      config: [
        {
          name: '值1',
          value: 'value1'
        },
        {
          name: '值2',
          value: 'value2'
        }
      ]
    },
    upload: {
      name: '上传',
      type: 'upload'
    },
    color: {
      name: '颜色',
      type: 'color'
    },
    slider: {
      name: '滑块',
      type: 'slider',
      config: {
        max: 10,
        min: 0,
        step: 1
      }
    },
    nest: {
      name: 'nest',
      type: 'collapse',
      items: {
        nest1: {
          name: 'nest1',
          type: 'collapse',
          items: {
            foo: {
              name: 'foo',
              type: 'upload'
            },
            bar: {
              name: 'bar',
              type: 'switch',
              config: {
                on: true,
                off: false
              }
            },
            nest2: {
              name: 'nest2',
              type: 'collapse',
              items: {
                foo: {
                  name: 'foo',
                  type: 'input'
                },
                nest3: {
                  name: 'nest3',
                  type: 'collapse',
                  items: {
                    name: {
                      name: 'name',
                      type: 'select',
                      config: [
                        {
                          name: '1',
                          value: '1'
                        }, {
                          name: '2',
                          value: '2'
                        }
                      ]
                    }
                  }
                }
              }
            }
          }
        },
        prop1: {
          name: 'prop1',
          type: 'input'
        },
        prop2: {
          name: 'prop2',
          type: 'input'
        }
      }
    }
  }
};

function reducer(action, state = initialState) {
  return state;
}

class Property extends React.Component {
  constructor() {
    super();
  }

  renderProperety(property) {
    return Object.keys(property).map((key, idx) => (
      <div key={idx} >
        {key}:{typeof property[key] === 'object' ? this.renderProperety(property[key]) : property[key]}
      </div>
    ))
  }

  render() {
    const { property, style } = this.props;
    return (
      /** 注意: class加前缀避免冲突! */
      <div className='example-property' style={{ ...style }}>
        {
          this.renderProperety(property)
        }
      </div>
    );
  }
}

export default {
  reducer: reducer,
  component: Property,
  option
};
