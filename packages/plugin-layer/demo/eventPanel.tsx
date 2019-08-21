import { Event } from '@xeditor/event-panel';
import { Event as EvtNode, useEvent } from '@xeditor/plugin-event';
import * as React from 'react';

export function Panel() {
  const evt = useEvent();
  const [disableBtn, setDisableBtn] = React.useState(false);
  const [compId, setCompId] = React.useState(-1);

  React.useEffect(() => {
    evt.subscribeChooseComp('chooseComp', (state: IFeatureState | null) => {
      if (state !== null) {
        setCompId(state.id!);
      }
      setDisableBtn(false);
    });
    return () => evt.unSubscribeChooseComp('chooseComp');
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
          <button title='选择组件' disabled={disableBtn} onClick={() => { evt.emitChooseCompAction('chooseComp'); setDisableBtn(true); }}>@</button>
        id: {compId}
        <button onClick={() => evt.emptyEvent(compId)}>新增Event</button>
        <button onClick={() => evt.newNode('EmptyCondition', evt.getCurrNode(), { nested: true })} >新增条件</button>
        <button onClick={() => evt.newNode('EmptyAction', evt.getCurrNode())} >新增动作</button>
        <button onClick={() => evt.newNode('EmptyForLoop', evt.getCurrNode())}>新增循环</button>
      </div>
      {
        sourceIds.map((id) => {
          const ftr = evt.getFeatureById(id);
          if (typeof ftr === 'undefined') {
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
