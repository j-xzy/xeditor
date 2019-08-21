import { useStore } from '../../packages/annie';
import React from 'react';
import update from 'immutability-helper';

function Box(props) {
  const {
    state,
    emit
  } = useStore([0]);
  const style = update(state[0]['style'], {});
  return <div style={style}>{props.children}</div>;
}

export default Box;