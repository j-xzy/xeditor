import { RawEvent as EventComp1, reducer as reducer1 } from './eventComp1';
import { RawEvent as EventComp2, reducer as reducer2 } from './eventComp2';

const fn: any = () => { /** */ };

export const data: Editor.ICanvaData = {
  root: {
    option: {
      resizer: false,
      toolbar: false,
      container: true,
      history: true
    },
    reducer: fn,
    props: {},
    component: null as any,
    state: {
      name: 'body',
      id: 1,
      style: {
        visibility: 'visible',
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
        scale: 1
      }
    },
    children: [
      {
        option: {
          resizer: true,
          toolbar: true,
          container: false,
          history: true,
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
                name: '赋值1',
                type: 'assgin1'
              },
              {
                name: 'xxxxx1',
                type: 'xxxxx1'
              }
            ]
          }
        },
        reducer: reducer1,
        component: EventComp1,
        state: {
          name: '事件组件1',
          style: {
            visibility: 'visible',
            margin: '15px 0',
            padding: '10px 0',
            width: '300px',
            height: '177.77777777777777px',
            float: 'none',
            display: 'block',
            position: 'relative',
            overflow: 'hidden',
            top: 'auto',
            left: 'auto'
          },
          id: 2
        },
        props: {},
        children: []
      },
      {
        reducer: reducer2,
        component: EventComp2,
        option: {
          resizer: true,
          toolbar: true,
          container: false,
          history: true,
          event: {
            trigger: [
              {
                name: '按一下2',
                type: 'fooClick2'
              },
              {
                name: '鼠标移上2',
                type: 'mouseHover2'
              }
            ],
            response: [
              {
                name: '赋值2',
                type: 'assgin2'
              },
              {
                name: 'xxxxx2',
                type: 'xxxxx2'
              }
            ]
          }
        },
        state: {
          name: '事件组件2',
          style: {
            visibility: 'visible',
            margin: '15px 0',
            padding: '10px 0',
            width: '530px',
            height: '102.22222222222223px',
            float: 'none',
            display: 'block',
            position: 'relative',
            overflow: 'hidden',
            top: 'auto',
            left: 'auto'
          },
          id: 3
        },
        props: {},
        children: []
      },
      {
        reducer: reducer2,
        component: EventComp2,
        props: {},
        option: {
          resizer: true,
          toolbar: true,
          container: false,
          history: true,
          event: {
            trigger: [
              {
                name: '按一下2',
                type: 'fooClick2'
              },
              {
                name: '鼠标移上2',
                type: 'mouseHover2'
              }
            ],
            response: [
              {
                name: '赋值2',
                type: 'assgin2'
              },
              {
                name: 'xxxxx2',
                type: 'xxxxx2'
              }
            ]
          }
        },
        state: {
          name: '事件组件2',
          style: {
            visibility: 'visible',
            margin: '15px 0',
            padding: '10px 0',
            width: '530px',
            height: '102.22222222222223px',
            float: 'none',
            display: 'block',
            position: 'relative',
            overflow: 'hidden',
            top: 'auto',
            left: 'auto'
          },
          id: 4
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
              type: 'ForLoop',
              state: {
                disabled: false,
                countExps: [
                  {
                    id: 7,
                    disabled: false,
                    value: ''
                  }
                ],
                id: 6
              },
              children: [
                {
                  type: 'Action',
                  state: {
                    targetId: 2,
                    type: '',
                    data: [
                      {
                        id: 3,
                        disabled: false,
                        value: '123'
                      }
                    ],
                    id: 2,
                    disabled: true
                  },
                  children: []
                }
              ]
            },
            {
              type: 'Condition',
              state: {
                disabled: false,
                logic: '||',
                operator: '===',
                leftExps: [
                  {
                    id: 11,
                    disabled: false,
                    value: '213123'
                  }
                ],
                rightExps: [
                  {
                    id: 12,
                    disabled: false,
                    value: ''
                  },
                  {
                    id: 15,
                    disabled: false,
                    value: {
                      id: 1,
                      property: 'height'
                    }
                  },
                  {
                    id: 16,
                    disabled: false,
                    value: ''
                  }
                ],
                id: 10
              },
              children: [
                {
                  type: 'Action',
                  state: {
                    targetId: -1,
                    type: '',
                    data: [
                      {
                        id: 5,
                        disabled: false,
                        value: ''
                      }
                    ],
                    id: 4,
                    disabled: false
                  },
                  children: []
                }
              ]
            },
            {
              type: 'Action',
              state: {
                targetId: -1,
                type: '',
                data: [
                  {
                    id: 14,
                    disabled: false,
                    value: ''
                  }
                ],
                id: 13,
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
      height: '1000px',
      position: 'absolute',
      top: '150px',
      width: '600px',
      left: '0px',
      scale: 0.9,
      border: '1px solid black'
    }
  }
};
