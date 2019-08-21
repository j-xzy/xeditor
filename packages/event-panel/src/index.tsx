import { Action, BaseNode, Condition, Event as EvtNode, ForLoop, IEventPluginState, Time, WhileLoop } from '@xeditor/plugin-event';
import { EvtEmitter } from 'evt-emit';
import * as React from 'react';
import { ActionNode } from './actionNode';
import { Block } from './block';
import { ConditionNode } from './conditionNode';
import { EventNode } from './eventNode';
import { LoopNode } from './loopNode';
import { Placeholder } from './placeholder';
import './style.styl';
import './style/base.styl';
import { TimeNode } from './timeNode';

interface IProps extends Partial<IOpts> {
  compId: number;
  evt: IEventPluginState;
}

export interface IOpts {
  actionSelectOpts: ISelectOpts;
  conditionSelectOpts: ISelectOpts;
  loopSelectOpts: ISelectOpts;
  propertySelectOpts: ISelectOpts;
  timeSelectOpts: ISelectOpts;
}

export type ISelectOpts = Array<{ name: string; value: string }>;

export interface IPlaceProps {
  nodeId: number;
  type: 'top' | 'bottom' | 'center' | 'none';
}

export class Event extends React.Component<IProps, IPlaceProps> {
  private preCurrNode: BaseNode | null = null;
  private rooRef: React.RefObject<HTMLDivElement> = React.createRef();

  constructor(props: IProps) {
    super(props);
    this.getPlaceholder = this.getPlaceholder.bind(this);
    this.setPlaceholder = this.setPlaceholder.bind(this);
    this.state = {
      nodeId: -1,
      type: 'none'
    };
  }

  public componentDidUpdate() {
    if (this.preCurrNode !== this.props.evt.getCurrNode()) {
      EvtEmitter.Instance.emit(this.props.evt.getCurrNode());
      EvtEmitter.Instance.emit(this.preCurrNode);
    }
    this.preCurrNode = this.props.evt.getCurrNode();
  }

  public render() {
    const eventNodes: EvtNode[] = [];
    this.props.evt.eventNode.getChildren().forEach((child) => {
      if ((child as EvtNode).sourceId === this.props.compId) {
        eventNodes.push(child as EvtNode);
      }
    });

    if (eventNodes.length === 0) {
      return null;
    }

    const opts = {
      actionSelectOpts: this.props.actionSelectOpts || [],
      conditionSelectOpts: this.props.conditionSelectOpts || [],
      loopSelectOpts: this.props.loopSelectOpts || [],
      propertySelectOpts: this.props.propertySelectOpts || [],
      timeSelectOpts: this.props.timeSelectOpts || []
    };

    return (
      <div className='evt-root' ref={this.rooRef}>
        {eventNodes.map((eventNode) => renderNode(eventNode, this.props.evt, this.setPlaceholder, this.getPlaceholder, opts, false))}
        <Placeholder {...this.state} rootEL={this.rooRef.current} />
        <Block {...this.state} rootEL={this.rooRef.current} />
      </div>
    );
  }

  private getPlaceholder() {
    return this.state;
  }

  private setPlaceholder(p: IPlaceProps) {
    this.setState({
      type: p.type,
      nodeId: p.nodeId
    });
  }
}

function renderNode(node: BaseNode, evt: IEventPluginState, setPlaceholder: (p: IPlaceProps) => void, getPlaceholder: () => IPlaceProps, opts: IOpts, isLastChild: boolean): JSX.Element | null {
  if (node.type === 'Event') {
    return (
      <EventNode
        evt={evt}
        getPlaceholder={getPlaceholder}
        setPlaceholder={setPlaceholder}
        node={node as EvtNode}
        isLastChild={isLastChild}
        selectOpts={opts}
        key={node.id}>
      </EventNode>
    );
  }

  if (node.type === 'Action') {
    return (
      <ActionNode
        node={node as Action}
        getPlaceholder={getPlaceholder}
        setPlaceholder={setPlaceholder}
        evt={evt}
        isLastChild={isLastChild}
        selectOpts={opts}
        key={node.id} >
      </ActionNode>
    );
  }

  if (node.type === 'Condition') {
    return (
      <ConditionNode
        setPlaceholder={setPlaceholder}
        getPlaceholder={getPlaceholder}
        evt={evt}
        key={node.id}
        node={node as Condition}
        selectOpts={opts}
        isLastChild={isLastChild} >
      </ConditionNode>
    );
  }

  if (node.type === 'Time') {
    return (
      <TimeNode
        setPlaceholder={setPlaceholder}
        getPlaceholder={getPlaceholder}
        evt={evt}
        key={node.id}
        node={node as Time}
        selectOpts={opts}
        isLastChild={isLastChild} >
      </TimeNode>
    );
  }

  if (node.type === 'ForLoop' || node.type === 'WhileLoop') {
    return (
      <LoopNode
        setPlaceholder={setPlaceholder}
        getPlaceholder={getPlaceholder}
        key={node.id}
        node={node as ForLoop | WhileLoop}
        evt={evt}
        selectOpts={opts}
        isLastChild={isLastChild} >
      </LoopNode>
    );
  }

  return null;
}

export function renderChildren(parent: BaseNode, evt: IEventPluginState, setPlaceholder: (p: IPlaceProps) => void, getPlaceholder: () => IPlaceProps, opts: IOpts) {
  const child = parent.getChildren() as BaseNode[];
  return child.map((node, idx) => renderNode(node, evt, setPlaceholder, getPlaceholder, opts, idx === child.length - 1));
}
