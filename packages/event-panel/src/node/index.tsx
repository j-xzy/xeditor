import { BaseNode, IEventPluginState } from '@xeditor/plugin-event';
import { EvtEmitter } from 'evt-emit';
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
import { IOpts, renderChildren } from '../index';
import { IPlaceProps } from '../index';
import './style.styl';

interface IProps extends React.Props<any> {
  style?: React.CSSProperties;
  className?: string;
  disabledBtn?: boolean;
  isEvent?: boolean;
  setPlaceholder: (p: IPlaceProps) => void;
  getPlaceholder: () => IPlaceProps;
  isLastChild: boolean;
  evt: IEventPluginState;
  node: BaseNode;
  color: [number, number, number];
  selectOpts: IOpts;
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
      node: props.node,
      isEvent: props.isEvent
    };
  },
  endDrag(props: IProps) {
    props.setPlaceholder({ type: 'none', nodeId: props.node.id });
  }
};

const Target = {
  hover(props: IProps, monitor: DropTargetMonitor, component: React.FunctionComponentElement<IProps> | null) {
    if (!component || component.props.node.id === monitor.getItem().node.id || !monitor.isOver({ shallow: true })) {
      return;
    }

    if (monitor.getItem().isEvent) {
      return props.setPlaceholder({ type: 'none', nodeId: props.node.id });
    }

    if (props.isEvent) {
      return props.setPlaceholder({ type: 'center', nodeId: props.node.id });
    }

    const dom = document.getElementById(`evt-node-${props.node.id}`);
    const offset = monitor.getClientOffset();
    if (dom && offset) {
      const rect = dom.getBoundingClientRect();
      const hoverMiddleY = (rect.bottom - rect.top) / 2;
      const hoverClientY = offset.y - rect.top;
      if (hoverClientY < hoverMiddleY - 3) {
        return props.setPlaceholder({ type: 'top', nodeId: props.node.id });
      }
      if (hoverClientY > hoverMiddleY + 3) {
        return props.setPlaceholder({ type: 'bottom', nodeId: props.node.id });
      }
      props.setPlaceholder({ type: 'center', nodeId: props.node.id });
    }
  },
  drop(props: IProps, monitor: DropTargetMonitor) {
    if (monitor.didDrop()) {
      return;
    }
    const placeType = props.getPlaceholder().type;
    let type = 'none';
    if (placeType === 'center') {
      type = 'child';
    }
    if (placeType === 'top') {
      type = 'predecessor';
    }
    if (placeType === 'bottom') {
      type = 'successor';
    }
    if (type !== 'none') {
      const source = monitor.getItem().node as BaseNode;
      const target = props.node;
      const sourceParent = source.Parent;
      const targetParent = target.Parent;
      props.evt.move(source, target, type as any);
      EvtEmitter.Instance.emit(sourceParent);
      if (type === 'child') {
        EvtEmitter.Instance.emit(target);
      }
      if (type !== 'child' && sourceParent !== targetParent) {
        EvtEmitter.Instance.emit(targetParent);
      }
    }
  }
};

function RawNode(props: IProps & ISourceCollectedProps & ITargetCollectedProps) {
  const [isClose, setIsClose] = React.useState(false);
  const [, forceUpdate] = React.useState({});

  React.useEffect(() => {
    const update = () => forceUpdate({});
    EvtEmitter.Instance.subscribe(props.node, update);
    return () => EvtEmitter.Instance.unSubscribe(props.node, update);
    // 必须每次update时重新绑定监听,因为回退时node会发生变化
  });

  const cls = props.node.disabled ? 'evt-disable' : 'evt-enble';
  const disabledBtn = typeof props.disabledBtn === 'undefined' ? true : props.disabledBtn;
  const Children = React.Children.toArray(props.children);
  const isLastChild = typeof props.isEvent === 'undefined' || props.isEvent === false;
  const ChildNodes = renderChildren(props.node, props.evt, props.setPlaceholder, props.getPlaceholder, props.selectOpts);
  const background = `rgba(${props.color[0]},${props.color[1]},${props.color[2]},${props.node === props.evt.getCurrNode() ? 1 : 0.7})`;

  return props.connectDropTarget(
    props.connectDragSource(
      <div id={`evt-id-${props.node.id}`} className='evt' style={{ opacity: props.isDragging ? 0.5 : 1 }}>
        <div onClick={() => props.evt.setCurrNode(props.node)} id={`evt-node-${props.node.id}`} className={`evt-node ${typeof props.className === 'undefined' ? '' : props.className}`} style={{ ...props.style, background }}>
          <div className='evt-node-left'>
            {disabledBtn && <i className={`icon-circle evt-disabled ${cls}`} onClick={() => props.node.dispatch('disabled', !props.node.disabled)} />}
            {Children[0]}
          </div>
          {
            Children[2] ?
              <div className='evt-node-right-wrapper'>
                <div className='evt-node-right'>
                  {Children[1]}
                </div>
                <div className='evt-node-right-down'>
                  {Children[2]}
                </div>
              </div>
              :
              <div className='evt-node-right'>
                {Children[1]}
              </div>
          }
        </div>
        {
          isLastChild &&
          [
            <span key='ver' style={{ height: props.isLastChild ? '15px' : '100%' }} className='evt-node-line evt-node-line-ver'></span>,
            <span key='hor' className='evt-node-line evt-node-line-hor'></span>
          ]
        }
        {
          isLastChild && ChildNodes.length !== 0 && (isClose || props.isDragging) &&
          <i className='icon-yj evt-node-expand' onClick={() => setIsClose(!isClose)} />
        }
        {
          isLastChild && ChildNodes.length !== 0 && !isClose &&
          <i className='icon-y- evt-node-expand' onClick={() => setIsClose(!isClose)} />
        }
        <div className='evt-node-child' hidden={isClose || props.isDragging}>
          {ChildNodes}
        </div>
      </div>
    ));
}

export const Node = DropTarget<IProps, ITargetCollectedProps>(
  'EVTNODE',
  Target,
  (connect: DropTargetConnector) => ({
    connectDropTarget: connect.dropTarget()
  })
)(
  DragSource<IProps, ISourceCollectedProps>(
    'EVTNODE',
    Source,
    (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging()
    })
  )(RawNode)
);
