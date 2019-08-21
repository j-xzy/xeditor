import { useChoose } from '@xeditor/plugin-choose';
import { Event as EvtNode, useEvent } from '@xeditor/plugin-event';
import * as React from 'react';
import { Event } from '../src';

const opts = {
  actionSelectOpts: [{ name: 'action', value: 'act' }],
  conditionSelectOpts: [{ name: 'cond', value: 'cond' }],
  loopSelectOpts: [{ name: 'loop', value: 'loop' }],
  propertySelectOpts: [{ name: 'prop', value: 'prop' }],
  timeSelectOpts: [{ name: 'time', value: 'time' }]
};

export function Panel() {
  const evt = useEvent();
  const choose = useChoose();
  const [disableBtn, setDisableBtn] = React.useState(false);
  const [compId, setCompId] = React.useState(-1);

  React.useEffect(() => {
    choose.subscribeChoose('chooseComp', (state: Editor.IFeatureState | null) => {
      if (state !== null) {
        setCompId(state.id!);
      }
      setDisableBtn(false);
    });
    return () => choose.unSubscribeChoose('chooseComp');
  });

  const sourceIds: number[] = [];
  evt.eventNode.getChildren().forEach((node) => {
    if ((node as EvtNode).type === 'Event' && !sourceIds.includes((node as EvtNode).sourceId)) {
      sourceIds.push((node as EvtNode).sourceId);
    }
  });

  return (
    <div>
      <div style={{ margin: '5px 0' }}>
        选择组件:
          <button title='选择组件' disabled={disableBtn} onClick={() => { choose.emitChooseAction('chooseComp'); setDisableBtn(true); }}>@</button>
        id: {compId}
        <button onClick={() => evt.emptyEvent(compId)}>新增Event</button>
        <button onClick={() => evt.newNode('EmptyCondition', evt.getCurrNode(), { nested: true })} >新增条件</button>
        <button onClick={() => evt.newNode('EmptyAction', evt.getCurrNode())} >新增动作</button>
        <button onClick={() => evt.newNode('EmptyForLoop', evt.getCurrNode())}>新增循环</button>
        <button onClick={() => evt.newNode('EmptyTime', evt.getCurrNode())}>新增延时/定时器</button>
      </div>
      {
        sourceIds.map((id) => {
          const ftr = evt.getFeatureById(id);
          if (!ftr) {
            return null;
          }
          return (
            <Event {...opts} key={id} compId={ftr.State.id!} evt={evt} />
          );
        })
      }
    </div>
  );
}
