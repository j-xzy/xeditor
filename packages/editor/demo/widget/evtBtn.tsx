import * as React from 'react';
import { useEvent } from '../../src';

export function EvtBtn(props: { compId: number }) {
  const evt = useEvent();
  return (
    <div>
      <button onClick={() => evt.emptyEvent(props.compId)}>新增事件</button>
      <button onClick={() => evt.newNode('EmptyCondition', evt.getCurrNode(), { nested: true })} >新增条件</button>
      <button onClick={() => evt.newNode('EmptyAction', evt.getCurrNode())} >新增动作</button>
      <button onClick={() => evt.newNode('EmptyForLoop', evt.getCurrNode())}>新增循环</button>
      <button onClick={() => evt.newNode('EmptyTime', evt.getCurrNode())} >新增延时/定时</button>
    </div>
  );
}
