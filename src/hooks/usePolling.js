import { useEffect, useRef } from 'react';
import { usePageVisibility } from './usePageVisibility';

export function usePolling(callback, delay) {
  const isVisible = usePageVisibility();
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null && isVisible) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay, isVisible]);
}