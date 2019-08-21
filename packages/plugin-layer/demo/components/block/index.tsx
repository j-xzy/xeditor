import * as React from 'react';
import { IPlaceProps } from '../index';
import './style.styl';

export function Block(props: IPlaceProps & { rootEL: HTMLDivElement | null }) {
  const el = document.getElementById(`layer-node-${props.nodeId}`);
  if (props.type !== 'child' || !props.rootEL || !el) {
    return null;
  }

  const { left: rLeft, top: rTop } = props.rootEL.getBoundingClientRect();
  const { left: eLeft, top: eTop, width, height } = el.getBoundingClientRect();
  const left = eLeft - rLeft;
  const top = eTop - rTop;

  return (
    <div className='evt-block' style={{ left, top, width, height }}>
    </div>
  );
}
