import { Loading } from '@/base/loading';
import * as React from 'react';
import './style.styl';

export function Mask() {
  const mask = window.useMappedState(React.useCallback((s) => s.mask, []));

  if (!mask) {
    return null;
  }

  return (
    <div className='mask'>
      <div className='mask-loading'>
        <Loading text={mask} />
      </div>
    </div>
  );
}
