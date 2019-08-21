declare namespace Editor {

  interface IFeatureOption {
    box?: boolean; // 容器组件标识
    path?: string; // 该组件源码路径
    property?: IWidget;
    event?: Editor.PluginEvent.IEventOpt;
    data?: IJson
  }

  interface ICanvaStoreState {
    property: {
      adaptation: boolean;
      refresh: number;
      [p: string]: any;
    }
  }

  interface IFeatureState {
    property?: any;
    data?: any;
  }

  interface IState {
    // 属性
    property?: {
      [p: string]: any;
    };

    // 数据
    data?: any;
    [p: string]: any;
  }

  interface IWidget {
    [p: string]: ISlider | IColor | IInput | ISelect | ISwitch | IRadio | ICheckbox | IJson | IUpload | ICollapse;
  }

  interface ICollapse {
    name: string;
    type: 'collapse';
    items: IWidget;
  }

  interface ISlider {
    name: string;
    type: 'slider';
    config: {
      max: number;
      min: number;
      step: number;
    };
    binded?: boolean;
  }

  interface IJson {
    name: string;
    type: 'json';
    binded?: boolean;
  }

  interface IColor {
    name: string;
    type: 'color';
    binded?: boolean;
  }

  interface ICheckbox {
    name: string;
    type: 'checkbox';
    config: Array<{ name: string, value: any }>;
    binded?: boolean;
  }

  interface IRadio {
    name: string;
    type: 'radio';
    config: Array<{ name: string, value: any }>;
    binded?: boolean;
  }

  interface IInput {
    name: string;
    type: 'input';
    binded?: boolean;
  }

  interface ISelect {
    name: string;
    type: 'select';
    config: Array<{ name: string, value: any }>;
    binded?: boolean;
  }

  interface ISwitch {
    name: string;
    type: 'switch';
    config: {
      on: any;
      off: any;
    };
    binded?: boolean;
  }

  interface IUpload {
    name: string;
    type: 'upload';
    binded?: boolean;
  }
}

declare module 'requirejs-esmodule';