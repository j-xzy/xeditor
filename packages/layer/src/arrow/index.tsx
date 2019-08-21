import * as React from 'react';
import './style.styl';

interface IProps {
  direction: 'left' | 'top' | 'right' | 'bottom';
  className?: string;
  onClick?: () => void;
}

export const Arrow = React.memo(RawArrow, (pre, next) => pre.direction === next.direction && pre.className === next.className);

function RawArrow(props: IProps) {
  let deg = '0deg';
  if (props.direction === 'left') {
    deg = '90deg';
  }
  if (props.direction === 'top') {
    deg = '180deg';
  }
  if (props.direction === 'right') {
    deg = '270deg';
  }
  const cls = props.className;
  return <div className={`layer-arrow ${typeof cls === 'undefined' ? '' : cls}`} style={{ transform: `rotate(${deg})` }} onClick={props.onClick}></div>;
}
