declare namespace Editor {
  type ICanvasControlComponentProps = {}

  type ICanvasControlComponentClass<T> = React.ComponentClass<T>;

  type ICanvasControlWrappedCompoent<R> = React.ComponentClass<R> | React.StatelessComponent<R>;

  interface IMapCanvasStateToProps {
    (state: Editor.ICanvaStoreState, ownProps: any): any;
  }
}