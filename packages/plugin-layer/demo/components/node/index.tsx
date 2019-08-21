import * as React from 'react';
import {
  ConnectDragSource,
  ConnectDropTarget,
  DragSource,
  DragSourceConnector,
  DragSourceMonitor,
  DropTarget,
  DropTargetConnector,
  DropTargetMonitor
} from 'react-dnd';
import { ILayerPluginState } from '../../../src';
import { Arrow } from '../arrow';
import { DoubleInput } from '../doubleInput';
import { Eye } from '../eye';
import { IPlaceProps } from '../index';
import './style.styl';

interface IProps {
  node: IFeature;
  layer: ILayerPluginState;
  getPlaceholder: () => IPlaceProps;
  setPlaceholder: (place: IPlaceProps) => void;
  level: number;
}

interface ISourceCollectedProps {
  isDragging: boolean;
  connectDragSource: ConnectDragSource;
}

interface ITargetCollectedProps {
  connectDropTarget: ConnectDropTarget;
}

const Source = {
  beginDrag(props: IProps) {
    return {
      node: props.node
    };
  },
  endDrag(props: IProps) {
    props.setPlaceholder({ type: 'none', nodeId: -1 });
  }
};

const Target = {
  hover(props: IProps, monitor: DropTargetMonitor, component: React.FunctionComponentElement<IProps> | null) {
    if (!monitor.isOver({ shallow: true })) {
      return;
    }

    const dom = document.getElementById(`layer-node-${props.node.State.id}`);
    const offset = monitor.getClientOffset();
    if (props.node.State.id === (monitor.getItem().node as IFeature).State.id) {
      return props.setPlaceholder({ type: 'none', nodeId: -1 });
    }

    if (dom && offset) {
      const rect = dom.getBoundingClientRect();
      const hoverMiddleY = (rect.bottom - rect.top) / 2;
      const hoverClientY = offset.y - rect.top;
      if (hoverClientY < hoverMiddleY - 3) {
        return props.setPlaceholder({ type: 'predecessor', nodeId: props.node.State.id! });
      }
      if (hoverClientY > hoverMiddleY + 3) {
        return props.setPlaceholder({ type: 'successor', nodeId: props.node.State.id! });
      }
      if (props.node.Option.container) {
        return props.setPlaceholder({ type: 'child', nodeId: props.node.State.id! });
      }
    }
  },
  drop(props: IProps, monitor: DropTargetMonitor) {
    if (monitor.didDrop()) {
      return;
    }
    const placeholder = props.getPlaceholder();
    if (placeholder.type === 'none') {
      return;
    }
    const sourceId = (monitor.getItem().node as IFeature).State.id!;
    props.layer.move(sourceId, props.node.State.id!, placeholder.type);
  }
};

function RawNode(props: IProps & ISourceCollectedProps & ITargetCollectedProps) {
  const { node, layer, isDragging } = props;
  const [, forceUpdate] = React.useState({});
  const [collapse, setCollapse] = React.useState(false);

  React.useEffect(() => {
    const update = () => forceUpdate({});
    node.Store.subscribe(update);
    return () => node.Store.unSubscribe(update);
  });

  const state = node.State;
  const isSelected = layer.selectedId === props.node.State.id;
  const isEyeClosed = state.style ? state.style.visibility === 'hidden' : false;
  const children = node.getChildren();

  return props.connectDropTarget(
    props.connectDragSource((
      <div className='layer-node'>
        <div id={`layer-node-${state.id}`} className='layer-node-item' style={{ opacity: isSelected ? 0.8 : 1 }} onClick={() => layer.updateSelectedFtr(state.id!)} >
          <Eye isClosed={isEyeClosed} className='layer-node-eye' onClick={() => layer.updateVisible(state.id!, isEyeClosed)} />
          <span style={{ minWidth: props.level * 15 }}></span>
          {children.length !== 0 && <Arrow direction={`${collapse || isDragging ? 'right' : 'bottom'}` as any} className='layer-node-arrow' onClick={() => setCollapse(!collapse)} />}
          <DoubleInput value={node.Name} onChange={(e) => layer.updateName(state.id!, e.target.value)} />
        </div>
        <div style={{ display: `${collapse || isDragging ? 'none' : 'block'}` }}>
          {
            children.map(
              (child) => <Node
                key={(child as IFeature).Id}
                getPlaceholder={props.getPlaceholder}
                layer={props.layer}
                level={props.level + 1}
                setPlaceholder={props.setPlaceholder}
                node={child as IFeature}
              />
            )
          }
        </div>
      </div>
    )));
}

export const Node = DropTarget<IProps, ITargetCollectedProps>(
  'LAYNODE',
  Target,
  (connect: DropTargetConnector) => ({
    connectDropTarget: connect.dropTarget()
  })
)(
  DragSource<IProps, ISourceCollectedProps>(
    'LAYNODE',
    Source,
    (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging()
    })
  )(RawNode)
);
