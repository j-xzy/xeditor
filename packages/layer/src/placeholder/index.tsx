import * as React from 'react';
import { IPlaceProps } from '../index';
import './style.styl';

export function Placeholder(props: IPlaceProps & { rootEL: HTMLDivElement | null }) {
  const el = document.getElementById(`layer-node-${props.nodeId}`);

  if (props.type === 'none' || props.type === 'child' || !props.rootEL || !el) {
    return null;
  }

  let margin = '-3px 0 0 0';
  if (props.type === 'successor') {
    margin = `${el.getBoundingClientRect().height - 4}px 0 0 0`;
  }

  const height = '8px';
  const { left: rLeft, top: rTop } = props.rootEL.getBoundingClientRect();
  const { left: eLeft, top: eTop, width } = el.getBoundingClientRect();
  const left = eLeft - rLeft + props.rootEL.scrollLeft;
  const top = eTop - rTop + props.rootEL.scrollTop;

  return (
    <div className='evt-placeholder' style={{ left, top, width, height, margin }}>
      <div className='evt-placeholder-inner'></div>
    </div>
  );
}
