import * as React from 'react';
import './style.styl';

export function Progress() {
  const on = window.useMappedState((s) => s.progress);
  return <div className={`progress ${on ? 'progress-animation' : ''}`}></div>;
}
