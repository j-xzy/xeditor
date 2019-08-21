import * as React from 'react';

export function useThrottle(fn: (...p: any[]) => void, delay: number | null) {
  const timer: React.MutableRefObject<number | null> = React.useRef(null);
  const callback = React.useRef(fn);

  React.useEffect(() => {
    callback.current = fn;
  }, [fn]);

  const throttle = React.useCallback(function closureThrottle(this: void, ...params: any[]) {
    if (delay === null) {
      clearTimeout(timer.current!);
      return;
    }
    if (!timer.current) {
      callback.current.apply(this, params);
      timer.current = window.setTimeout(() => {
        clearTimeout(timer.current!);
        timer.current = null;
        callback.current.apply(this, params);
      }, delay);
    }
  }, [delay]);

  React.useEffect(() => {
    return () => {
      // unmounted时清除
      timer.current && clearTimeout(timer.current);
    };
  }, []);

  return throttle;

}
