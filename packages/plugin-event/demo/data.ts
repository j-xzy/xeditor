import { RawEvent as EventComp1, reducer as reducer1 } from './eventComp1';
import { RawEvent as EventComp2, reducer as reducer2 } from './eventComp2';

const fn: any = () => { /** */ };

export const data: any = {
  root: {
    reducer: fn,
    option: {
      resizer: false,
      toolbar: false,
      container: true,
      history: true,
      group: '画布'
    },
    state: {
      name: '画布',
      id: 1,
      style: {
        margin: '0',
        padding: '0',
        width: '100%',
        height: '100%',
        float: 'none',
        display: 'block',
        position: 'relative',
        top: '0',
        left: '0',
        overflow: 'hidden',
        zIndex: 0,
        visibility: 'visible'
      }
    },
    children: [
      {
        reducer: reducer1,
        component: EventComp1,
        option: {
          resizer: true,
          toolbar: true,
          container: false,
          history: true,
          group: '画布',
          property: {
            foo: {
              name: '中文1',
              type: 'input'
            },
            bar: {
              name: '中文2',
              type: 'select',
              config: [{ name: 'name', value: 'value' }]
            }
          },
          event: {
            trigger: [
              {
                name: '按一下1',
                type: 'fooClick1'
              },
              {
                name: '鼠标移上1',
                type: 'mouseHover1'
              }
            ],
            response: [
              {
                name: '设置属性',
                type: 'setProperty'
              },
              {
                name: '设置样式',
                type: 'setStyle'
              },
              {
                name: 'xxxxx',
                type: 'xxxx'
              }
            ]
          }
        },
        state: {
          name: '事件组件1',
          style: {
            position: 'relative',
            visibility: 'visible',
            display: 'block',
            float: 'none',
            width: '100px',
            height: '100px',
            zIndex: 0,
            margin: '0px',
            padding: '10px',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0'
          },
          property: {
            foo: 'x',
            bar: 'y'
          },
          id: 2
        },
        children: []
      }
    ]
  },
  hidden: [],
  canvas: {
    eventState: {
      type: 'EventRoot',
      state: {
        id: 0,
        disabled: false
      },
      children: [
        {
          type: 'Event',
          state: {
            disabled: false,
            conditions: [],
            sourceId: 2,
            trigger: '',
            id: 1
          },
          children: [
            {
              type: 'Action',
              state: {
                targetId: 2,
                type: 'setStyle',
                data: [
                  {
                    id: 4,
                    disabled: false,
                    property: 'visibility',
                    data: [
                      {
                        id: 5,
                        disabled: false,
                        value: '123'
                      }
                    ]
                  },
                  {
                    id: 6,
                    disabled: false,
                    property: 'float',
                    data: [
                      {
                        id: 7,
                        disabled: false,
                        value: 'float'
                      },
                      {
                        id: 8,
                        disabled: false,
                        value: {
                          id: 1,
                          property: 'style.width'
                        }
                      },
                      {
                        id: 9,
                        disabled: false,
                        value: ''
                      }
                    ]
                  }
                ],
                id: 2,
                disabled: false
              },
              children: []
            }
          ]
        }
      ]
    },
    name: 'canvaStore',
    id: 0,
    style: {
      backgroundImage: 'url()',
      height: '800px',
      position: 'absolute',
      top: '150px',
      width: '800px',
      left: '0px',
      scale: 0.9,
      border: '1px solid black'
    }
  }
};
