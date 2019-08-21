import React from 'react';
import useInterval from './useInterval';

/**
 * @param {*} time 秒
 */
export default function useRefresh(time) {
  if (time <= 0) {
    return;
  }
  const [key, setKey] = React.useState(0);
  useInterval(() => {
    setKey(key + 1);
  }, time);
  return key;
}