import { Expression } from '@xeditor/expression';
import { Condition as CondNode, ForLoop, IEventPluginState, WhileLoop } from '@xeditor/plugin-event';
import { Select } from 'lite-ui/lib/select';
import * as React from 'react';
import { Condition } from '../condition';
import { equalForLoopState, equalWhileLoopState } from '../equal';
import { useSubscribes } from '../hooks/useSubscribes';
import { IOpts, IPlaceProps } from '../index';
import { Node } from '../node';
import './style.styl';

interface IProps extends React.Props<any> {
  evt: IEventPluginState;
  node: WhileLoop | ForLoop;
  isLastChild: boolean;
  setPlaceholder: (p: IPlaceProps) => void;
  getPlaceholder: () => IPlaceProps;
  selectOpts: IOpts;
}

export const LoopNode = React.memo(RawLoopNode, (pre, next) => {
  if (pre.isLastChild !== next.isLastChild || pre.node !== next.node) {
    return false;
  }
  if (pre.node.type === 'ForLoop') {
    return equalForLoopState((pre.node as ForLoop).State, (next.node as ForLoop).State);
  }
  if (pre.node.type === 'WhileLoop') {
    return equalWhileLoopState((pre.node as WhileLoop).State, (next.node as WhileLoop).State);
  }
  return true;
});

function RawLoopNode(props: IProps) {
  useSubscribes([props.node]);

  const type = props.node.type;
  let conditions: CondNode[] = [];
  if (type === 'WhileLoop') {
    conditions = (props.node as WhileLoop).condition.getChildren() as CondNode[];
  }
  return (
    <Node className='evt-loop-node' color={[164, 71, 197]} {...props} >
      <>
        <Select value={type} onChange={(e) => props.node.dispatch(e as 'ForLoop' | 'WhileLoop')}>
          <Select.Option value='ForLoop'>次数循环</Select.Option>
          <Select.Option value='WhileLoop'>条件循环</Select.Option>
        </Select>
        <i className='icon-fx evt-loop-fx' onClick={() => props.node.dispatch('remove')} />
      </>
      <>
        {
          type === 'ForLoop' &&
          <div className='evt-loop-first-item'>
            <span key='count' className='evt-loop-label'>次数</span>
            <Expression selectOpts={props.selectOpts.loopSelectOpts} getFeatureById={props.evt.getFeatureById} key='expre' placeholder='&nbsp;表达式/值' flag={`forLoop${props.node.id}`} nodes={(props.node as ForLoop).countExp.getChildren()} />
          </div>
        }
        {
          type === 'WhileLoop' && conditions.length > 0 &&
          <div className='evt-loop-first-item'>
            <Condition
              key={conditions[0].id}
              evt={props.evt}
              removeBtn={conditions.length > 1}
              node={conditions[0]}
              selectOpts={props.selectOpts}
            />
            <i key='addBtn' className='icon-fj evt-loop-add' onClick={() => props.evt.newNode('EmptyWithCondition', props.node)} />
          </div>
        }
        {
          type === 'WhileLoop' &&
          conditions.slice(1).map((con) => <Condition selectOpts={props.selectOpts} className='evt-loop-margin' key={con.id} evt={props.evt} node={con} />)
        }
      </>
    </Node>
  );
}
