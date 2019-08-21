import { EventWidget as EvtPanel, useEvent } from '@xeditor/editor';
import * as React from 'react';
import './style.styl';

interface IProps {
  ftrId: number;
}

// tslint:disable-next-line: no-default-export
export default function EventWidget(props: IProps) {
  return (
    <div className='event-widget'>
      <EvtBtns compId={props.ftrId} />
      <EvtPanel compId={props.ftrId} />
    </div>
  );
}

function EvtBtns(props: { compId: number }) {
  const evt = useEvent();
  return (
    <div className='event-btns'>
      <div style={{ background: '#3b5375' }} className='event-btn' onClick={() => evt.emptyEvent(props.compId)}>事件</div>
      <div style={{ background: '#0e6d0e' }} className='event-btn' onClick={() => evt.newNode('EmptyAction', evt.getCurrNode())} >动作</div>
      <div style={{ background: '#0e6d0e' }} className='event-btn' onClick={() => evt.newNode('EmptyForLoop', evt.getCurrNode())}>循环</div>
      <div style={{ background: '#2861b3' }} className='event-btn' onClick={() => evt.newNode('EmptyCondition', evt.getCurrNode(), { nested: true })} >条件</div>
      <div style={{ background: '#af7d23' }} className='event-btn' onClick={() => evt.newNode('EmptyTime', evt.getCurrNode())} >延时/定时</div>
    </div>
  );
}
