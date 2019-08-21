import { ftrStyleDic } from '../ftrProperty/ftrStyleDic';

interface ICanvasDic {
  style: Editor.IWidget;
  property: Editor.IWidget;
}

export const dic: ICanvasDic = {
  style: {
    ...ftrStyleDic
  },
  property: {
    refresh: {
      name: '刷新',
      type: 'input',
      binded: false
    },
    adaptation: {
      name: '自适应',
      type: 'switch',
      config: {
        on: true,
        off: false
      },
      binded: false
    }
  }
};
