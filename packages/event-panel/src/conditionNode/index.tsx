import { Condition as CondNode, IEventPluginState } from '@xeditor/plugin-event';
import * as React from 'react';
import { Condition } from '../condition';
import { equalConditionState } from '../equal';
import { useSubscribes } from '../hooks/useSubscribes';
import { IOpts, IPlaceProps } from '../index';
import { Node } from '../node';

interface IProps extends React.Props<any> {
  node: CondNode;
  evt: IEventPluginState;
  isLastChild: boolean;
  setPlaceholder: (p: IPlaceProps) => void;
  getPlaceholder: () => IPlaceProps;
  selectOpts: IOpts;
}

export const ConditionNode = React.memo(RawConditionNode, (pre, next) => {
  if (pre.isLastChild !== next.isLastChild || pre.node !== next.node) {
    return false;
  }

  return equalConditionState(pre.node.State, next.node.State);
});

function RawConditionNode(props: IProps) {
  useSubscribes([props.node]);

  return (
    <Node className='evt-condtion-node' disabledBtn={false} color={[50, 119, 218]} {...props} >
      <>
        <Condition selectOpts={props.selectOpts} evt={props.evt} node={props.node} />
      </>
      <>
        <i className='icon-fj' onClick={() => props.evt.newNode('EmptyCondition', props.node, { nested: false })} />
      </>
    </Node>
  );
}
