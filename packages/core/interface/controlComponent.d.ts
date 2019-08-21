declare namespace Editor {
  type IControlWrappedCompoent<R> = React.ComponentClass<R> | React.StatelessComponent<R>;

  type IControlComponentClass<T> = React.ComponentClass<T>;
}