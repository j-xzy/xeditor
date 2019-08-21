export const styleDic: { [p: string]: string } = {
  position: '定位',
  visibility: '显示',
  display: '元素类型',
  float: '浮动',
  width: '宽',
  height: '高',
  zIndex: '层级',
  margin: '外边距',
  padding: '内边距',
  top: '上',
  left: '左',
  right: '右',
  bottom: '下'
};

export interface IWidget {
  [p: string]: IInput | ISelect | ISwitch | ICheckbox;
}

interface IInput {
  name: string;
  type: 'input';
}

interface ISelect {
  name: string;
  type: 'select';
  config: Array<{ name: string, value: any }>;
}

interface ISwitch {
  name: string;
  type: 'switch';
  config: {
    on: any;
    off: any;
  };
}

interface ICheckbox {
  name: string;
  type: 'checkbox';
  config: Array<{ name: string, value: any }>;
}
