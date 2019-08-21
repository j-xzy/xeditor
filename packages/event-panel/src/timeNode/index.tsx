import { Expression } from '@xeditor/expression';
import { IEventPluginState, Time } from '@xeditor/plugin-event';
import { Select } from 'lite-ui/lib/select';
import * as React from 'react';
import { equalExpreStates } from '../equal';
import { useSubscribes } from '../hooks/useSubscribes';
import { IOpts, IPlaceProps } from '../index';
import { Node } from '../node';
import './style.styl';

interface IProps extends React.Props<any> {
  node: Time;
  evt: IEventPluginState;
  isLastChild: boolean;
  setPlaceholder: (p: IPlaceProps) => void;
  getPlaceholder: () => IPlaceProps;
  selectOpts: IOpts;
}

export const TimeNode = React.memo(RawTimeNode, (pre, next) => {
  if (pre.isLastChild !== next.isLastChild || pre.node !== next.node || pre.node.timeType !== next.node.timeType) {
    return false;
  }

  return equalExpreStates(pre.node.State.time, next.node.State.time);
});

export function RawTimeNode(props: IProps) {
  useSubscribes([props.node]);

  return (
    <Node className='evt-time-node' color={[208, 147, 36]} {...props} >
      <>
        <Select value={props.node.timeType} onChange={(e) => props.node.dispatch(e as 'Timeout' | 'Interval')}>
          <Select.Option value='Timeout'>延时</Select.Option>
          <Select.Option value='Interval'>定时</Select.Option>
        </Select>
        <i className='icon-fx evt-time-fx' onClick={() => props.node.dispatch('remove')} />
      </>
      <>
        <span key='count' className='evt-time-label'>时间</span>
        <Expression selectOpts={props.selectOpts.timeSelectOpts} getFeatureById={props.evt.getFeatureById} placeholder='&nbsp;表达式/值' flag={`${props.node.id}interval`} nodes={props.node.time.getChildren()} />
      </>
    </Node>
  );
}
