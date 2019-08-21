import * as React from 'react';

export function useResizeObserver(ref: React.MutableRefObject<null | HTMLDivElement>, callback: (...p: any[]) => void) {

  React.useEffect(() => {
    if (!ref.current) {
      return;
    }

    let resizeObserver = new (window as any).ResizeObserver(callback);
    resizeObserver.observe(ref.current);
    return () => {
      resizeObserver.unobserve(ref.current);
      resizeObserver = null;
    };
  }, [callback, ref.current]);
}
