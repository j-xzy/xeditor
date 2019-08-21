declare namespace Editor {
  interface IPreivewComponentProps {
    connect: (element: React.ReactNode) => React.ReactElement<any>;
    [p: string]: any;
  }

  type IPreivewComponentClassOrFunc = React.ComponentClass<IPreivewComponentProps | any> | React.StatelessComponent<IPreivewComponentProps | any>;

  type IPreivewComponent = React.Component<IPreivewComponentProps>;
}