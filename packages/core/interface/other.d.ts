declare namespace Editor {
  // 拖放在canvas上后返回的结果
  interface IBeginDragResult {
    WrappedFeatureComponentClassOrFunc?: IWrappedFeatureComponentClassOrFunc;
    reducer: Editor.IReducer<IFeatureState>;
    option: IFeatureOption;
    props: any;
  }

  // featureConnector第一个参数
  interface IFeatureOption {
    resizer?: boolean; // <Resizer /> 控件
    container?: boolean; // 是否是容器组件
    toolbar?: boolean; // <Toolbar /> 控件
    history?: boolean; // 异步组件
    group?: string; // 目标featureStore
  }

  // featureConnector第二个参数
  interface IPreviewArgs {
    PreivewComponent: Editor.IPreivewComponentClassOrFunc;
    dragImg: HTMLImageElement;
  }

  // sizeTool 缩放的方式
  type IResizingType = 'none' | 'top' | 'bottom' | 'left' | 'right' | 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft';

  // Obj的深层NonNullable
  type IObjNonNullable<T> = {
    [P in keyof T]: T[P] extends object ? IObjNonNullable<T[P]> : NonNullable<T[P]>;
  }

  type IPrimitive = string | number | boolean | undefined | null | Array<any>;

  interface ITreeObj {
    [P: string]: Array<JSX.Element | null>;
  }
}