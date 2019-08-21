import * as React from 'react';

export function useDebounce(fn: (...p: any[]) => any, delay: number | null) {
  const timer: React.MutableRefObject<number | null> = React.useRef(null);
  const callback = React.useRef(fn);

  React.useEffect(() => {
    timer.current && clearTimeout(timer.current);
    callback.current = fn;
  }, [fn]);

  const debounce = React.useCallback(function bounce(this: void, ...params: any[]) {
    timer.current && clearTimeout(timer.current);
    if (!delay) {
      return;
    }
    timer.current = window.setTimeout(() => {
      return callback.current.apply(this, params);
    }, delay);
  }, [delay]);

  React.useEffect(() => {
    return () => {
      // unmounted时清除
      timer.current && clearTimeout(timer.current);
    };
  }, []);

  return debounce;
}
