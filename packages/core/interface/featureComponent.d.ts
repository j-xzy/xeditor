declare namespace Editor {
  // 放在Canvas上的元素组件的Props
  interface IFeatureComponentProps {
    connectDropTarget?: any;
    isCurrOver?: boolean;
    children: React.ReactChild;
    ownProps: any;
    feature: IFeature;
  }

  // 放在Canvas上的元素组件的State 
  interface IFeatureComponentState { }

  // 放在Canvas上的元素组件的类
  type IFeatureComponentClass = React.ComponentClass<IFeatureComponentProps>;

  // 放在Canvas上的元素组件
  interface IFeatureComponent extends React.Component<IFeatureComponentProps, {}> { }

  // 放在Canvas上的元素组件的Elemnt
  type IFeatureElement = React.ReactElement<IFeatureComponentProps>;

  // 被包装的FeatureComponent的Props，也就是被featureConnector装饰的组件的props
  interface IWrappedFeatureComponentProps extends Partial<IBaseStyle> {
    [p: string]: any;
    remove: () => void;
    appendChildFeatures: IAppendChildFeatures;
    replace: IReplace;
    connect: IConnect;
  }

  type IAppendChildFeatures = (features: Array<{ option: Editor.IFeatureOption, reducer: Editor.IReducer<IFeatureState>, component: IWrappedFeatureComponentClassOrFunc, props: any }>) => void;
  type IReplace = (option: Editor.IFeatureOption, reducer: Editor.IReducer<IFeatureState>, previewProps: any, NestingWrappedFeatureComponentClass: IWrappedFeatureComponentClassOrFunc, newId?: boolean, dispatchDelete?: boolean) => void;
  type IConnect = (element: JSX.Element) => JSX.Element;

  // 被包装的FeatureComponent，也就是被featureConnector装饰的组件
  interface IWrappedFeatureComponent extends React.Component<IWrappedFeatureComponentProps, any> { }

  // 被包装的FeatureComponent的类，也就是被featureConnector装饰的组件的类
  type IWrappedFeatureComponentClassOrFunc = React.ComponentClass<IWrappedFeatureComponentProps & any> | React.StatelessComponent<IWrappedFeatureComponentProps & any>;

  // 被包装的FeatureComponent的Element
  type IWrappedFeatureElement = React.ReactElement<IWrappedFeatureComponentProps>;

  // FeatureComponent的Context
  interface IFeatureContext {
    featureId: number;
  }
}