import * as React from 'react';
import { ConnectDragPreview, ConnectDragSource, DragSource, DragSourceConnector, DragSourceMonitor } from 'react-dnd';
import { Context, IStores } from '../components/provider';
import { DROP_TARGET_PREVIEW } from '../lib/common';
import { throwIfCompositeComponentElement } from '../lib/tool';
import { defaultOption } from '../store/feature/config';

export interface IProps {
  connectDragSource: ConnectDragSource;
  connectDragPreview: ConnectDragPreview;
}

export type IPreviewClass<T> = React.ComponentClass<T>;

export function featureConnector<T>(option: Editor.IFeatureOption, preview: Editor.IPreviewArgs, reducer: Editor.IReducer<any>) {
  return function Hoc(WrappedFeatureComponentClass?: Editor.IWrappedFeatureComponentClassOrFunc) {
    return preivewAdvance<T>(option, preview, reducer, WrappedFeatureComponentClass);
  };
}

function preivewAdvance<T>(option: Editor.IFeatureOption, preview: Editor.IPreviewArgs, reducer: Editor.IReducer<Editor.IFeatureState>, WrappedFeatureComponentClassOrFunc?: Editor.IWrappedFeatureComponentClassOrFunc): IPreviewClass<T> {
  const dragSource = {
    beginDrag(props: IProps): Editor.IBeginDragResult {
      const { connectDragSource, connectDragPreview, ...ownProps } = props;
      return {
        WrappedFeatureComponentClassOrFunc,
        props: ownProps,
        reducer,
        option: { ...defaultOption, ...option }
      };
    },
    endDrag(_props: IProps, _monitor: DragSourceMonitor, components: Preview) {
      components.context.FeatureStore.updateDragEnterFeature(null);
      components.context.FeatureStore.updateSelectedFeature(null);
    }
  };

  function collect(connector: DragSourceConnector) {
    return {
      connectDragPreview: connector.dragPreview(),
      connectDragSource: connector.dragSource()
    };
  }

  class Preview extends React.Component<IProps, {}> {

    public static contextType = Context;
    public context!: IStores;

    private domRef: React.RefObject<HTMLElement> = React.createRef();

    constructor(props: IProps) {
      super(props);
      this.connect = this.connect.bind(this);
    }

    public render() {
      const { connectDragSource, connectDragPreview, ...ownProps } = this.props;
      return React.createElement(preview.PreivewComponent, { connect: this.connect, ...ownProps });
    }

    public componentDidMount() {
      this.props.connectDragSource!(this.domRef.current!);
      preview.dragImg.onload = () => this.props.connectDragPreview!(preview.dragImg);
    }

    private connect(element: JSX.Element) {
      throwIfCompositeComponentElement(element);
      return React.cloneElement(element, {
        ref: this.domRef
      });
    }
  }

  return DragSource(DROP_TARGET_PREVIEW, dragSource, collect)(Preview) as any;
}
