import { Event } from '@xeditor/event-panel';
import { useChoose } from '@xeditor/plugin-choose';
import * as React from 'react';
import { Event as EvtNode, useEvent } from '../lib';

export function Panel() {
  const evt = useEvent();
  const choose = useChoose();
  const [disableBtn, setDisableBtn] = React.useState(false);
  const [compId, setCompId] = React.useState(-1);

  React.useEffect(() => {
    choose.subscribeChoose('chooseComp', (state: IFeatureState | null) => {
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
      </div>
      {
        sourceIds.map((id) => {
          const ftr = evt.getFeatureById(id);
          if (!ftr) {
            return null;
          }
          return (
            <Event key={id} compId={ftr.State.id!} evt={evt} />
          );
        })
      }
    </div>
  );
}
