import { Expression } from '@xeditor/expression';
import { Condition as CondNode, IEventPluginState } from '@xeditor/plugin-event';
import { Select } from 'lite-ui/lib/select';
import * as React from 'react';
import { equalConditionState } from '../equal';
import { useSubscribes } from '../hooks/useSubscribes';
import { IOpts } from '../index';
import './style.styl';

interface IProps {
  className?: string;
  removeBtn?: boolean;
  evt: IEventPluginState;
  node: CondNode;
  selectOpts: IOpts;
}

export const Condition = React.memo(RawCondition, (pre, next) => {
  if (pre.className !== next.className || pre.node !== next.node || pre.removeBtn !== next.removeBtn) {
    return false;
  }

  return equalConditionState(pre.node.State, next.node.State);
});

function RawCondition(props: IProps) {
  useSubscribes([props.node]);
  const cls = props.node.disabled ? 'evt-disable' : 'evt-enble';

  return (
    <div className={`evt-cdt ${typeof props.className === 'undefined' ? '' : props.className} `}>
      <i className={`icon-circle evt-disabled ${cls} evt-cdt-disabled`} onClick={() => props.node.dispatch('disabled', !props.node.disabled)} />
      <Select className='evt-cdt-logic' value={props.node.logic} onChange={(e) => props.node.dispatch('logic', e)}>
        <Select.Option value='&&'>且</Select.Option>
        <Select.Option value='||'>或</Select.Option>
      </Select>
      <Expression selectOpts={props.selectOpts.conditionSelectOpts} getFeatureById={props.evt.getFeatureById} placeholder='&nbsp;表达式/值' flag={`${props.node.id}left`} nodes={props.node.leftExp.getChildren()} />
      <Select className='evt-cdt-operator' value={props.node.operator} onChange={(e) => props.node.dispatch('operator', e)}>
        <Select.Option value='==='>=</Select.Option>
        <Select.Option value='>'>&gt;</Select.Option>
        <Select.Option value='<'>&lt;</Select.Option>
        <Select.Option value='!=='>!=</Select.Option>
        <Select.Option value='>='>&gt;=</Select.Option>
        <Select.Option value='<='>&lt;=</Select.Option>
      </Select>
      <Expression selectOpts={props.selectOpts.conditionSelectOpts} getFeatureById={props.evt.getFeatureById} placeholder='&nbsp;表达式/值' flag={`${props.node.id}right`} nodes={props.node.rightExp.getChildren()} />
      {(typeof props.removeBtn === 'undefined' || props.removeBtn) && <i className='icon-fx evt-cdt-fx' onClick={() => props.node.dispatch('remove')} />}
    </div>
  );
}
