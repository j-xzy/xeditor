import * as React from 'react';
import { IPlaceProps } from '../index';
import './style.styl';

export function Block(props: IPlaceProps & { rootEL: HTMLDivElement | null }) {
  const el = document.getElementById(`evt-node-${props.nodeId}`);
  if (props.type !== 'center' || !props.rootEL || !el) {
    return null;
  }

  const { left: rLeft, top: rTop } = props.rootEL.getBoundingClientRect();
  const { left: eLeft, top: eTop, width, height } = el.getBoundingClientRect();
  const left = eLeft - rLeft + props.rootEL.scrollLeft;
  const top = eTop - rTop + props.rootEL.scrollTop;

  return (
    <div className='evt-block' style={{ left, top, width, height }}>
    </div>
  );
}
