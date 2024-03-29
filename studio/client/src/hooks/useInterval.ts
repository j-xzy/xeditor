import * as React from 'react';

export function useInterval(callback: (...p: any[]) => void, delay: number | null) {
  const savedCallback: React.MutableRefObject<(...p: any[]) => void> = React.useRef(callback);

  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
