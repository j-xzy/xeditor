import { Event } from '@xeditor/event-panel';
import { useEvent } from '@xeditor/plugin-event';
import * as React from 'react';

const baseOpts = [
  { name: '默认参数', value: 'data' },
  { name: 'X', value: 'window.global.ps.x' },
  { name: 'Y', value: 'window.global.ps.y' }
];

export function EventWidget(props: { compId: number }) {
  const evt = useEvent();
  const opts = {
    actionSelectOpts: baseOpts,
    conditionSelectOpts: baseOpts,
    loopSelectOpts: baseOpts,
    propertySelectOpts: baseOpts,
    timeSelectOpts: baseOpts
  };

  return <Event evt={evt} {...opts} compId={props.compId} />;
}
