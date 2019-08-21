import { Condition as CondNode, Event as EvtNode, IEventPluginState } from '@xeditor/plugin-event';
import { Select } from 'lite-ui/lib/select';
import * as React from 'react';
import { Condition } from '../condition';
import { equalEventState } from '../equal';
import { useSubscribes } from '../hooks/useSubscribes';
import { IOpts, IPlaceProps } from '../index';
import { Node } from '../node';
import './style.styl';

interface IProps extends React.Props<any> {
  node: EvtNode;
  evt: IEventPluginState;
  isLastChild: boolean;
  setPlaceholder: (p: IPlaceProps) => void;
  getPlaceholder: () => IPlaceProps;
  selectOpts: IOpts;
}

export const EventNode = React.memo(RawEventNode, (pre, next) => {
  if (pre.isLastChild !== next.isLastChild || pre.node !== next.node) {
    return false;
  }

  return equalEventState(pre.node.State, next.node.State);
});

function RawEventNode(props: IProps) {
  useSubscribes([props.node]);

  let trigger: Editor.PluginEvent.IEventOpt['trigger'] = [];

  const ftr = props.evt.getFeatureById(props.node.sourceId);

  if (!ftr) {
    return null;
  }

  if (ftr.Option.event && ftr.Option.event.trigger) {
    trigger = ftr.Option.event.trigger;
  }

  const conditions = props.node.condition.getChildren() as CondNode[];

  return (
    <Node color={[50, 119, 218]} className='evt-event-node' {...props} isEvent={true}>
      <>
        <Select className='evt-event-left-select' value={props.node.trigger} onChange={(e) => props.node.dispatch('trigger', e)}>
          {props.node.trigger === '' && <Select.Option key='' value=''>触发条件</Select.Option>}
          {
            trigger.map(({ name, type }) => <Select.Option key={type} value={type}>{name}</Select.Option>)
          }
        </Select>
        <i onClick={() => props.node.dispatch('remove')} className='icon-fx evt-event-fx' />
      </>
      <>
        {
          typeof conditions[0] !== 'undefined' &&
          <div className='evt-right-first-cdt'>
            <Condition selectOpts={props.selectOpts} key={conditions[0].id} evt={props.evt} node={conditions[0]} />
            <i onClick={() => props.evt.newNode('EmptyWithCondition', props.node)} className='icon-fj evt-event-fj' />
          </div>
        }
        {
          conditions.slice(1).map((con) => {
            return <Condition selectOpts={props.selectOpts} className='evt-right-cdt' key={con.id} evt={props.evt} node={con} />;
          })
        }
        {conditions.length === 0 && <i onClick={() => props.evt.newNode('EmptyWithCondition', props.node)} className='icon-fj' />}
      </>
    </Node>
  );
}
